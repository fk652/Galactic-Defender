// GameView handles anything canvas/html related, and event handlers
// Also creates the single Game object that handles all game logic

import Game from "./game";
import Boss from "./boss";

class GameView {
  // player movement keybind mappings
  static UP_KEYS = ["ArrowUp", 'w']
  static DOWN_KEYS = ["ArrowDown", 's']
  static RIGHT_KEYS = ["ArrowRight", 'd']
  static LEFT_KEYS = ["ArrowLeft", 'a']

  // prevent shooting when clicking these html elements
  static IGNORE_TARGETS = [
    "sound-on", 
    "sound-off", 
    "sound-icons-container", 
    "touch-on", 
    "touch-off", 
    "touch-container",
    "pause-on", 
    "pause-off", 
    "pause-container"
  ]

  constructor(canvas, canvasContext) {
    this.ctx = canvasContext;
    this.canvas = canvas;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.game = new Game(canvas, this);

    // html game info elements that get updated throughout the game
    this.scoreSpan = document.getElementById("score");
    this.playerHealthBar = document.getElementById("player-health-bar");
    this.bossHealthBar = document.getElementById("boss-health-bar");
    this.bossInfo = document.getElementById("boss-info");
    this.waveInfo = document.getElementById("wave-info");
    this.waveSpan = document.getElementById("wave-number");
    this.enemiesRemainingSpan = document.getElementById("enemies-remaining");

    // moving background in the canvas element
    // x, y are the background position offsets as it moves (only y changes)
    // dy controls change in speed
    const backgroundImg = new Image();
    backgroundImg.src = "src/assets/images/game_background.png";
    this.bgSettings = {
      img: backgroundImg,
      x: 0,
      y: 700,
      dy: 0.5
    }

    // mouse follow options
    this.touchOnElement = document.getElementById("touch-on");
    this.touchOffElement = document.getElementById("touch-off");
    this.mouseFollow = false;
    this.mousePosition = null; // {x: xValue, y: yValue}
    
    // pause options
    this.pauseOnElement = document.getElementById("pause-on");
    this.pauseOffElement = document.getElementById("pause-off");
    this.pauseText = document.getElementById("pause-text");
    this.pause = false;
    this.toggleSound = false;

    // only want to draw start, win, and game over messages once;
    this.messageDrawn = false;

    this.bindSettingListeners();
    this.bindStartHandler();
  }
  
  // starts up the animate recursive call loop, and draws initial background
  start() {
    this.lastTime = 0;
    this.drawBackground();
    requestAnimationFrame(this.animate.bind(this));
  }

  // draw next state of the game, or start/win/game over message
  // takes in time, which is automatically given and kept track off in recursive calls
  animate(time) {
    if (this.game.startScreen || this.game.gameOver || this.game.win) {
      if (this.pause) this.handlePauseToggle();
      this.drawStartWinGameOver();
    } else if (!this.pause) {
      this.draw();
      this.updateGameInfo();
      const timeDelta = time - this.lastTime;
      this.game.step(timeDelta);
    }

    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }

  // draw start/win/game over message once and remove player controls
  drawStartWinGameOver() {
    if (!this.messageDrawn) {
      const message = this.game.startScreen 
                      ?  ["Press any key or click here to", "START"]
                      : this.game.secretEnd
                        ? "🫡"
                        : this.game.gameOver
                          ? "GAME OVER"
                          : "YOU WIN"

      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";

      if (this.game.startScreen) {
        this.ctx.font = "40px roboto";
        this.ctx.fillText(message[0], this.canvasWidth/2, this.canvasHeight/2 - 50);
        this.ctx.font = "48px roboto";
        this.ctx.fillText(message[1], this.canvasWidth/2, this.canvasHeight/2);
      } else {
        this.ctx.font = "48px roboto";
        this.ctx.fillText(message, this.canvasWidth/2, this.canvasHeight/2);
      }
      this.messageDrawn = true;

      if (this.game.gameOver || this.game.win) {
        this.removeControlHandlers();
        this.updateScore();
        setTimeout(this.drawRetryKey.bind(this, this.ctx), 3000)
      };
    }
  }

  drawRetryKey() {
    const message = "(press any key or click here to retry)";
    this.ctx.font = "24px roboto";
    this.ctx.fillText(message, this.canvasWidth/2, this.canvasHeight/2 + 50);
    this.bindRetryHandler();
  }

  drawPause() {
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.font = "48px roboto";
    this.ctx.fillText("PAUSED", this.canvasWidth/2, this.canvasHeight/2);
  }

  // draw moving background and then all game objects
  draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawBackground();

    for (let key in this.game.allMovingObjects) {
      Object.values(this.game.allMovingObjects[key]).forEach(obj => obj.draw(this.ctx));
    }
  }

  // canvas background moves vertically downward
  drawBackground() {
    const img = this.bgSettings.img;

    // if end is reached, reset image back to beginning
    if (this.bgSettings.y > this.canvasHeight) {
      this.bgSettings.y -= img.height;
    }

    // if looping around, cut remaining end and draw below new
    if (this.bgSettings.y > 0) {
      this.ctx.drawImage(img, this.bgSettings.x, this.bgSettings.y - img.height, img.width, img.height);
    }

    // draw background and then update new position
    this.ctx.drawImage(img, this.bgSettings.x, this.bgSettings.y, img.width, img.height);
    this.bgSettings.y += this.bgSettings.dy;
  }

  // updates all game info related html elements
  updateGameInfo() {
    this.updateScore();
    this.updateHealthBar('player');

    if (this.game.bossFight) {
      this.updateHealthBar('boss');
    } else {
      this.waveSpan.innerText = this.game.enemyWave;
      this.enemiesRemainingSpan.innerText = this.game.enemiesRemaining;
    }
  }

  updateScore() {
    this.scoreSpan.innerText = this.game.score;
  }

  // updates either boss or player hp
  // type is a string of either 'player' or 'boss'
  updateHealthBar(type) {
    let obj, healthBar;
    if (type === 'player') {
      obj = this.game.player;
      healthBar = this.playerHealthBar;
    } else {
      obj = this.game.boss;
      healthBar = this.bossHealthBar;
    }
    let health = obj.health;

    const healthPoint = document.createElement("li");
    healthPoint.setAttribute("class", `${type}-health-point`);

    if (type === 'boss') health = Math.ceil(health / (Boss.MAX_HEALTH / 10));

    if (healthBar.children.length < health) {
      for (let i = 0; i < health - healthBar.children.length; i++) {
        healthBar.appendChild(healthPoint);
      }
    } else if ((healthBar.children.length > health)) {
      for (let i = 0; i < healthBar.children.length - health; i++) {
        const lastChild = healthBar.lastChild;
        if (lastChild) healthBar.removeChild(healthBar.lastChild);
      }
    }
  }

  // switches between boss and enemy wave html elements 
  switchGameInformation() {
    if (this.game.bossFight) {
      this.waveInfo.style.display = "none";
      this.bossInfo.style.display = "flex";
    } else {
      this.waveInfo.style.display = "flex";
      this.bossInfo.style.display = "none";
    }
  }

  // start playing the game
  handleStartKey(event) {
    if (event?.key === " ") event.preventDefault();

    this.canvas.scrollIntoView();
    this.game.sounds.switchBGM("waveBGM");
    this.game.startScreen = false;
    document.removeEventListener("keypress", this.startHandler)
    this.canvas.removeEventListener("pointerdown", this.startHandler)
    this.bindControlHandlers();
    setTimeout(this.game.resetAddEnemyCooldown.bind(this.game), 1500);
    this.messageDrawn = false;
  }

  bindStartHandler() {
    this.startHandler = this.handleStartKey.bind(this);
    document.addEventListener("keypress", this.startHandler);
    this.canvas.addEventListener("pointerdown", this.startHandler);
  }

  // retry on win/game over
  handleRetryKey(event) {
    if (event?.key === " ") event.preventDefault();

    this.canvas.scrollIntoView();
    document.removeEventListener("keypress", this.retryHandler);
    this.canvas.removeEventListener("pointerdown", this.retryHandler);
    this.game.reset();
    this.bindControlHandlers();
    setTimeout(this.game.resetAddEnemyCooldown.bind(this.game), 1500);
    this.messageDrawn = false;
  }

  bindRetryHandler() {
    this.retryHandler = this.handleRetryKey.bind(this);
    document.addEventListener("keypress", this.retryHandler);
    this.canvas.addEventListener("pointerdown", this.retryHandler);
  }

  // mouse/touch follow movements
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const xScale = this.canvas.width / rect.width;
    const yScale = this.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * xScale;
    const y = (event.clientY - rect.top) * yScale;
    this.mousePosition = {x, y};
  }

  handleMouseOut() {
    this.mousePosition = null;
  }

  handleMouseFollowToggle() {
    if (this.mouseFollow) {
      this.touchOnElement.style.display = 'none';
      this.touchOffElement.style.display = 'block';
    } else {
      this.touchOnElement.style.display = 'block';
      this.touchOffElement.style.display = 'none';
    }

    this.mouseFollow = !this.mouseFollow;
  }

  // pause/unpause
  handlePauseToggle() {
    if ((this.game.startScreen || this.game.gameOver || this.game.win) && !this.pause) {
      return;
    }

    if (this.pause) {
      this.game.resumeTimers();
      this.pauseOnElement.style.display = 'none';
      this.pauseOffElement.style.display = 'block';
      this.pauseText.innerText = 'pause';
    } else {
      this.game.pauseTimers();
      this.pauseOnElement.style.display = 'block';
      this.pauseOffElement.style.display = 'none';
      this.pauseText.innerText = 'play';
      this.drawPause();
    }

    this.pause = !this.pause;
  }

  // pause and mute when tabbed out or game is out of focus
  handleVisibilityChange() {
    if (
      document.hidden && 
      !(this.game.startScreen || this.game.gameOver || this.game.win) && 
      !this.pause
    ) {
      this.handlePauseToggle();
    }

    if (document.hidden && this.game.sounds.toggle) {
      this.game.sounds.handleSoundToggle();
      this.toggleSound = true;
    } else if (!document.hidden && this.toggleSound) {
      this.game.sounds.handleSoundToggle();
      this.toggleSound = false;
    }
  }

  // setting option keybinds
  handleSettingKeybinds(event) {
    if (event.key === "m") this.handleMouseFollowToggle();
    else if (event.key === "k") this.game.sounds.handleSoundToggle();
    else if (event.key === "p") this.handlePauseToggle();
  }

  // binds all setting related handlers (pause/unpause, mouse/touch follow, mute/unmute)
  bindSettingListeners() {
    document.addEventListener("keydown", this.handleSettingKeybinds.bind(this));

    const touchContainer = document.getElementById("touch-icons-container");
    touchContainer.addEventListener("click", this.handleMouseFollowToggle.bind(this));
    if (( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 )) {
      document.getElementById("touch-text").innerText = "touch follow"
      this.handleMouseFollowToggle();
    }

    const pauseContainer = document.getElementById("pause-icons-container");
    pauseContainer.addEventListener("click", this.handlePauseToggle.bind(this));
    document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
  }

  // player controls (arrow/wasd to move, spacebar to shoot)
  handleKeyDown(event) {
    event.preventDefault();

    if (GameView.RIGHT_KEYS.includes(event.key)) this.game.player.keysPressed.right = true;
    else if (GameView.LEFT_KEYS.includes(event.key)) this.game.player.keysPressed.left = true;
    else if (GameView.UP_KEYS.includes(event.key)) this.game.player.keysPressed.up = true;
    else if (GameView.DOWN_KEYS.includes(event.key)) this.game.player.keysPressed.down = true;
    else if (event.key === " ") this.game.player.keysPressed.shoot = true;
  }
  
  handleKeyUp(event) {
    event.preventDefault();

    if (GameView.RIGHT_KEYS.includes(event.key)) this.game.player.keysPressed.right = false;
    else if (GameView.LEFT_KEYS.includes(event.key)) this.game.player.keysPressed.left = false;
    else if (GameView.UP_KEYS.includes(event.key)) this.game.player.keysPressed.up = false;
    else if (GameView.DOWN_KEYS.includes(event.key)) this.game.player.keysPressed.down = false;
    else if (event.key === " ") this.game.player.keysPressed.shoot = false;
  }

  // mouse click/hold to shoot
  handleMouseDown(event) {
    const parentId = event.target.parentNode.id;
    if (!GameView.IGNORE_TARGETS.includes(parentId)) this.game.player.keysPressed.shoot = true;
  }

  handleMouseUp() {
    this.game.player.keysPressed.shoot = false;
  }

  // binding and removing player controls
  bindControlHandlers() {
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseOutHandler = this.handleMouseOut.bind(this);

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
    document.addEventListener("pointerdown", this.mouseDownHandler);
    document.addEventListener("pointerup", this.mouseUpHandler);
    document.addEventListener("pointermove", this.mouseMoveHandler);
    document.addEventListener("pointerout", this.mouseOutHandler);
  }

  removeControlHandlers() {
    document.removeEventListener("keydown", this.keyDownHandler);
    document.removeEventListener("keyup", this.keyUpHandler);
    document.removeEventListener("pointerdown", this.mouseDownHandler);
    document.removeEventListener("pointerup", this.mouseUpHandler);
    document.removeEventListener("pointermove", this.mouseMoveHandler);
    document.removeEventListener("pointerout", this.mouseOutHandler);
  }
}

export default GameView;