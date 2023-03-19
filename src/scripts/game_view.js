import Game from "./game";
import Boss from "./boss";

class GameView {
  static UP_KEYS = ["ArrowUp", 'w']
  static DOWN_KEYS = ["ArrowDown", 's']
  static RIGHT_KEYS = ["ArrowRight", 'd']
  static LEFT_KEYS = ["ArrowLeft", 'a']
  static IGNORE_TARGETS = ["sound-on", "sound-off", "sound-icons-container"]

  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.game = new Game(canvas, this);

    this.scoreSpan = document.getElementById("score");
    this.playerHealthBar = document.getElementById("player-health-bar");
    this.bossHealthBar = document.getElementById("boss-health-bar");
    this.bossInfo = document.getElementById("boss-info");
    this.waveInfo = document.getElementById("wave-info");
    this.waveSpan = document.getElementById("wave-number");
    this.enemiesRemainingSpan = document.getElementById("enemies-remaining");

    const backgroundImg = new Image();
    backgroundImg.src = "src/assets/game_background.png";
    this.backgroundOptions = {
      img: backgroundImg,
      scale: 550 / backgroundImg.height,
      x: 0,
      y: 0,
      dy: .75
    }

    this.messageDrawn = false;
    this.bindStartHandler();
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    if (this.game.startScreen || this.game.gameOver || this.game.win) {
      this.drawStartWinGameOver();
    } else {
      this.updateInformation();
      this.draw();
      const timeDelta = time - this.lastTime;
      this.game.step(timeDelta);
    }

    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawBackground();

    for (let key in this.game.allMovingObjects) {
      Object.values(this.game.allMovingObjects[key]).forEach(obj => obj.draw(this.ctx));
    }
  }

  drawBackground() {
    const img = this.backgroundOptions.img;
    const scale = this.backgroundOptions.scale;
    let imgW = img.width;
    let imgH = img.height;
    const x = this.backgroundOptions.x;

    if (imgH * scale > this.canvasHeight) this.backgroundOptions.y = this.canvasHeight - imgH;

    if (imgH * scale <= this.canvasHeight) {
      if (this.backgroundOptions.y > this.canvasHeight) this.backgroundOptions.y = -imgH + this.backgroundOptions.y;
      if (this.backgroundOptions.y > 0) this.ctx.drawImage(img, x, -imgH + this.backgroundOptions.y, imgW, imgH);
      if (this.backgroundOptions.y - imgH > 0) this.ctx.drawImage(img, x, -imgH * 2 + this.backgroundOptions.y, imgW, imgH);
    } else {
      if (this.backgroundOptions.y > this.canvasHeight) this.backgroundOptions.y = this.canvasHeight - imgH;
      if (this.backgroundOptions.y > this.canvasHeight - imgH) this.ctx.drawImage(img, x, this.backgroundOptions.y - imgH + 1, imgW, imgH);
    }

    this.ctx.drawImage(img, x, this.backgroundOptions.y, imgW, imgH);
    this.backgroundOptions.y += this.backgroundOptions.dy;
  }

  updateInformation() {
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

  switchGameInformation() {
    if (this.game.bossFight) {
      this.waveInfo.style.display = "none";
      this.bossInfo.style.display = "flex";
    } else {
      this.waveInfo.style.display = "flex";
      this.bossInfo.style.display = "none";
    }
  }

  drawStartWinGameOver() {
    if (!this.messageDrawn) {
      const message = this.game.startScreen 
                      ?  "Press any key to start"
                      : this.game.gameOver
                        ? "GAME OVER"
                        : "YOU WIN"

      this.ctx.font = "48px roboto";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(message, this.canvasWidth/2, this.canvasHeight/2);
      this.messageDrawn = true;
      if (this.game.gameOver || this.game.win) {
        this.removeControlHandlers();
        this.updateScore();
        setTimeout(this.drawRetryKey.bind(this, this.ctx), 3000)
      };
    }
  }

  drawRetryKey() {
    this.ctx.font = "24px roboto";
    this.ctx.fillText("(press any key to retry)", this.canvasWidth/2, this.canvasHeight/2 + 50);
    this.bindRetryHandler();
  }

  bindStartHandler() {
    this.startHandler = this.handleStartKey.bind(this);
    document.addEventListener("keypress", this.startHandler);
  }

  handleStartKey(event) {
    if (event.key === " ") event.preventDefault();
    if (event.key) {
      this.game.sounds.switchBGM("waveBGM");
      this.game.startScreen = false;
      document.removeEventListener("keypress", this.startHandler)
      this.bindControlHandlers();
      setTimeout(this.game.resetAddEnemyCooldown.bind(this.game), 1500);
      this.messageDrawn = false;
    }
  }

  bindRetryHandler() {
    this.retryHandler = this.handleRetryKey.bind(this);
    document.addEventListener("keypress", this.retryHandler);
  }

  handleRetryKey(event) {
    if (event.key === " ") event.preventDefault();
    if (event.key) {
      document.removeEventListener("keypress", this.retryHandler);
      this.game.reset();
      this.bindControlHandlers();
      setTimeout(this.game.resetAddEnemyCooldown.bind(this.game), 1500);
      this.messageDrawn = false;
    }
  }

  handleKeyDown(event) {
    event.preventDefault();

    if (GameView.RIGHT_KEYS.includes(event.key)) this.game.player.keysPressed.right = true;
    else if (GameView.LEFT_KEYS.includes(event.key)) this.game.player.keysPressed.left = true;
    else if (GameView.UP_KEYS.includes(event.key)) this.game.player.keysPressed.up = true;
    else if (GameView.DOWN_KEYS.includes(event.key)) this.game.player.keysPressed.down = true;
    else if (event.key === " ") this.game.player.keysPressed.shoot = true;
  }
  
  handleKeyUp(event) {
    if (event.key === " ") event.preventDefault();

    if (GameView.RIGHT_KEYS.includes(event.key)) this.game.player.keysPressed.right = false;
    else if (GameView.LEFT_KEYS.includes(event.key)) this.game.player.keysPressed.left = false;
    else if (GameView.UP_KEYS.includes(event.key)) this.game.player.keysPressed.up = false;
    else if (GameView.DOWN_KEYS.includes(event.key)) this.game.player.keysPressed.down = false;
    else if (event.key === " ") this.game.player.keysPressed.shoot = false;
  }

  handleMouseDown(event) {
    const parentId = event.target.parentNode.id;
    if (!GameView.IGNORE_TARGETS.includes(parentId)) this.game.player.keysPressed.shoot = true;
  }

  handleMouseUp() {
    this.game.player.keysPressed.shoot = false;
  }

  bindControlHandlers() {
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
    document.addEventListener("mousedown", this.mouseDownHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
  }

  removeControlHandlers() {
    document.removeEventListener("keydown", this.keyDownHandler);
    document.removeEventListener("keyup", this.keyUpHandler);
    document.removeEventListener("mousedown", this.mouseDownHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
  }
}

export default GameView;