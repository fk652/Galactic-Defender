import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Boss from "./boss";
import Sound from "./sound";

class Game {
  static MAX_ENEMY_WAVE = 5;

  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.messageDrawn = false;
    this.enemyWave = 0;
    // this.enemyWave = 5;
  
    this.addEnemyOnCooldown = true;
    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;
    this.score = 0;
    
    this.gameOver = false;
    this.win = false;
    this.startScreen = true;

    this.idCounter = 1;
    
    this.allMovingObjects = {
      player: {},
      enemies: {},
      projectiles: {},
      particles: {},
      explosions: {}
    };

    this.player = new PlayerShip(this);

    const bossInfo = document.getElementById("boss-info");
    bossInfo.style.display = 'none';
    this.bossFight = false;

    const backgroundImg = new Image();
    backgroundImg.src = "src/assets/game_background.png";
    this.backgroundOptions = {
      img: backgroundImg,
      scale: 550 / backgroundImg.height,
      x: 0,
      y: 0,
      dy: .75
    }

    this.sounds = new Sound(this);
  }

  step(timeDelta) {
    this.checkCollisions();
    this.updateInformation();
    this.setEnemies();
    this.moveObjects(timeDelta);
    this.shootProjectiles();
  }

  moveObjects(timeDelta) {
    for (let key in this.allMovingObjects) {
      Object.values(this.allMovingObjects[key]).forEach(obj => obj.move(timeDelta));
    }
  }

  shootProjectiles() {
    this.player.shootProjectile();
    Object.values(this.allMovingObjects.enemies).forEach(enemy => enemy.shootProjectile());
  }

  checkCollisions() {
    Object.values(this.allMovingObjects.projectiles).forEach((projectile) => {
      if (projectile) {
        if (projectile.origin === "player") {
          Object.values(this.allMovingObjects.enemies).forEach((enemy) => {
            if (enemy) enemy.collideCheck(projectile);
          })
        } else {
          if (this.player) this.player.collideCheck(projectile);
        }
      }
    })

    Object.values(this.allMovingObjects.enemies).forEach((enemy) => {
      if (enemy && this.player) this.player.collideCheck(enemy);
    })
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawBackground(ctx);

    for (let key in this.allMovingObjects) {
      Object.values(this.allMovingObjects[key]).forEach(obj => obj.draw(ctx));
    }
  }

  drawBackground(ctx) {
    const img = this.backgroundOptions.img;
    const scale = this.backgroundOptions.scale;
    let imgW = img.width;
    let imgH = img.height;
    const x = this.backgroundOptions.x;

    if (imgH * scale > this.canvasHeight) this.backgroundOptions.y = this.canvasHeight - imgH;

    if (imgH * scale <= this.canvasHeight) {
      if (this.backgroundOptions.y > this.canvasHeight) this.backgroundOptions.y = -imgH + this.backgroundOptions.y;
      if (this.backgroundOptions.y > 0) ctx.drawImage(img, x, -imgH + this.backgroundOptions.y, imgW, imgH);
      if (this.backgroundOptions.y - imgH > 0) ctx.drawImage(img, x, -imgH * 2 + this.backgroundOptions.y, imgW, imgH);
    } else {
      if (this.backgroundOptions.y > this.canvasHeight) this.backgroundOptions.y = this.canvasHeight - imgH;
      if (this.backgroundOptions.y > this.canvasHeight - imgH) ctx.drawImage(img, x, this.backgroundOptions.y - imgH + 1, imgW, imgH);
    }

    ctx.drawImage(img, x, this.backgroundOptions.y, imgW, imgH);
    this.backgroundOptions.y += this.backgroundOptions.dy;
  }

  updateInformation() {
    this.updateScore();
    this.updateHealthBar('player');

    if (this.bossFight) {
      this.updateHealthBar('boss');
    } else {
      const waveSpan = document.getElementById("wave-number");
      waveSpan.innerText = this.enemyWave;

      const enemiesRemainingSpan = document.getElementById("enemies-remaining");
      enemiesRemainingSpan.innerText = this.enemiesRemaining;
    }
  }

  updateScore() {
    const scoreSpan = document.getElementById("score");
    scoreSpan.innerText = this.score;
  }

  updateHealthBar(type) {
    const obj = (type === 'player' ? this.player : this.boss);
    const healthBar = document.getElementById(`${type}-health-bar`);

    const healthPoint = document.createElement("li");
    healthPoint.setAttribute("class", `${type}-health-point`);

    let health = obj.health;
    if (type === 'boss') health = Math.ceil(health / 2);

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

  healPlayer() {
    if (this.allMovingObjects.player) {
      const newHealth = this.player.health + 3;
      this.player.health = (newHealth > 10 ? 10 : newHealth);
    }
  }

  setEnemies() {
    if (this.enemiesRemaining === 0 && !this.bossFight) {
      if (this.enemyWave < Game.MAX_ENEMY_WAVE) {
        this.enemyWave += 1;
        this.enemyWaveCount = this.enemyWave * 5;
        this.enemiesRemaining = this.enemyWaveCount;
        this.addedEnemies = 0;
        this.score *= Math.ceil(this.player.health/2) || 1;
        this.healPlayer();
      } else {
        this.setBoss();
      }
    }

    if (!this.bossfight && !this.addEnemyOnCooldown) {
      const remaining = this.enemyWaveCount - this.addedEnemies;

      let numNewEnemies;
      if (remaining < 10) {
        numNewEnemies = remaining;
      } else {
        numNewEnemies = Math.floor(Math.random() * (10 - 3) + 3);
      }
      this.addedEnemies += numNewEnemies;

      for (let i = 0; i < numNewEnemies; i++) {
        const randPosX = Math.floor(Math.random() * this.canvasWidth);
        const randSpeed = Math.random() * (5 - 2) + 2;
        const randCooldown = Math.floor(Math.random() * (1000 - 450) + 450);
        const newEnemy = new EnemyShip(this, randPosX, randSpeed, randCooldown);
      }

      this.addEnemyOnCooldown = true;
      const randTimeOut = Math.random() * (3000 - 1000) + 1000;
      setTimeout(this.resetAddEnemyCooldown.bind(this), randTimeOut);
    }
  }

  resetAddEnemyCooldown() {
    this.addEnemyOnCooldown = false;
  }

  setBoss() {
    this.player.disabled = true;
    if (Object.values(this.allMovingObjects.projectiles).length === 0) {
      this.sounds.switchBGM("bossIncomingBGM");
      this.boss = new Boss(this);
      this.switchGameInformation();
      this.score *= Math.ceil(this.player.health/2) || 1;
      this.healPlayer();
      this.bossFight = true;
    }
  }

  switchGameInformation() {
    const bossInfo = document.getElementById("boss-info");
    const waveInfo = document.getElementById("wave-info");
    waveInfo.style.display = 'none';
    bossInfo.style.display = 'flex';
  }

  setWin() {
    this.player.removeControlHandlers();
    this.score *= this.player.health;
    this.updateScore();
    this.win = true;
    this.sounds.playWinSound();
  }

  setGameOver() {
    this.player.removeControlHandlers();
    this.gameOver = true;
    this.sounds.playGameOverSound();
  }

  drawStartWinGameOver(ctx) {
    const message = this.startScreen 
                      ?  "Press any key to start"
                      : this.gameOver
                        ? "GAME OVER"
                        : "YOU WIN"

    if (!this.messageDrawn) {
      ctx.font = "48px roboto";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(message, this.canvasWidth/2, this.canvasHeight/2);
      this.messageDrawn = true;
      if (this.gameOver || this.win) setTimeout(this.drawRetryKey.bind(this, ctx), 3000);
    }
  }

  drawRetryKey(ctx) {
    ctx.font = "24px roboto";
    ctx.fillText("(press any key to retry)", this.canvasWidth/2, this.canvasHeight/2 + 50);
    this.bindRetryHandler();
  }

  bindStartHandler() {
    this.startHandler = this.handleStartKey.bind(this);
    document.addEventListener("keypress", this.startHandler);
  }

  handleStartKey(event) {
    if (event.key === " ") event.preventDefault();
    if (event.key) {
      this.sounds.switchBGM("waveBGM");
      this.startScreen = false;
      document.removeEventListener("keypress", this.startHandler)
      this.player.bindControlHandlers();
      setTimeout(this.resetAddEnemyCooldown.bind(this), 1500);
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
      this.reset();
      this.player.bindControlHandlers();
      setTimeout(this.resetAddEnemyCooldown.bind(this), 1500);
      this.messageDrawn = false;
    }
  }

  reset() {
    this.messageDrawn = false;
    this.idCounter = 0;
    this.enemyWave = 0;
    this.addEnemyOnCooldown = true;
    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.startScreen = false;

    this.allMovingObjects = {
      player: {},
      enemies: {},
      projectiles: {},
      particles: {},
      explosions: {}
    };

    this.player = new PlayerShip(this);

    const bossInfo = document.getElementById("boss-info");
    bossInfo.style.display = "none";
    this.bossFight = false;
    
    const waveInfo = document.getElementById("wave-info");
    waveInfo.style.display = "flex";

    this.sounds.reset();
    this.sounds.switchBGM("waveBGM");
  }
}

export default Game;