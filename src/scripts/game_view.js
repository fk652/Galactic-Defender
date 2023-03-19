import Game from "./game";
import Boss from "./boss";

class GameView {
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
        this.game.player.removeControlHandlers();
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
      this.game.player.bindControlHandlers();
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
      this.game.player.bindControlHandlers();
      setTimeout(this.game.resetAddEnemyCooldown.bind(this.game), 1500);
      this.messageDrawn = false;
    }
  }
}

export default GameView;