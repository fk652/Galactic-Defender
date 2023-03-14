import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Boss from "./boss";

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

    this.player = new PlayerShip(this);
    
    this.allMovingObjects = {
      player: this.player,
      enemies: [],
      projectiles: [],
      particles: [],
      explosions: []
    };

    const bossInfo = document.getElementById("boss-info");
    bossInfo.style.display = 'none';
    this.bossFight = false;

    const img = new Image();
    img.src = "src/assets/game_background.png";
    this.backgroundOptions = {
      img: img,
      x: 0,
      y: 30,
      dy: .75
    }
    console.log(this.backgroundOptions.y);
  }

  step(timeDelta) {
    this.clearNulls();
    this.checkCollisions();
    this.updateInformation();
    this.setEnemies();
    this.moveObjects(timeDelta);
  }

  clearNulls() {
    for (let key in this.allMovingObjects) {
      const objectsValue = this.allMovingObjects[key]
      if (objectsValue instanceof Array) {
        const filtered = objectsValue.filter(el => el);
        this.allMovingObjects[key] = filtered;
      }
    }
  }

  moveObjects(timeDelta) {
    for (let key in this.allMovingObjects) {
      const objectsValue = this.allMovingObjects[key]
      if (objectsValue instanceof Array) {
        objectsValue.forEach(obj => {
          if (obj) obj.move(timeDelta)
        });
      } else {
        if (objectsValue) objectsValue.move(timeDelta);
      }
    }
  }

  checkCollisions() {
    // check projectile collisions
    // check projectile hitbox vs enemy hitboxes
    this.allMovingObjects.projectiles.forEach((projectile) => {
      if (projectile) {
        if (projectile.origin === "player") {
          this.allMovingObjects.enemies.forEach((enemy) => {
            if (enemy) enemy.collideCheck(projectile);
          })
        } else {
          if (this.player) this.player.collideCheck(projectile);
        }
      }
    })

    // check enemy to player collisions
    // check player hitbox vs enemy hitboxes
    this.allMovingObjects.enemies.forEach((enemy) => {
      if (enemy && this.player) this.player.collideCheck(enemy);
    })
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawBackground(ctx);

    for (let key in this.allMovingObjects) {
      const objectsValue = this.allMovingObjects[key]
      if (objectsValue instanceof Array) {
        objectsValue.forEach(obj => {
          if (obj) obj.draw(ctx);
        });
      } else {
        if (objectsValue) objectsValue.draw(ctx);
      }
    }
  }

  drawBackground(ctx) {
    const img = this.backgroundOptions.img;
    let imgW = img.width;
    let imgH = img.height;
    const x = 0;

    if (imgH > this.canvasHeight) this.backgroundOptions.y = this.canvasHeight - imgH;

    if (imgH <= this.canvasHeight) {
      if (this.backgroundOptions.y > this.canvasHeight) this.backgroundOptions.y = -imgH + this.backgroundOptions.y;
      if (this.backgroundOptions.y > 0) ctx.drawImage(img, x, -imgH + this.backgroundOptions.y, imgW, imgH);
      if (this.backgroundOptions.y - imgH > 0) ctx.drawImage(img, x, -imgH * 2 + this.backgroundOptions.y, imgW, imgH);
    } else {
      if (this.backgroundOptions.y > this.canvasHeight) this.backgroundOptions.y = this.canvasHeight - imgH;
      if (this.backgroundOptions.y > this.canvasHeight - imgH) ctx.drawImage(img, x, this.backgroundOptions.y - imgH + 1, imgW, imgH);
    }

    ctx.drawImage(img, x, this.backgroundOptions.y, imgW, imgH);
    this.backgroundOptions.y += this.backgroundOptions.dy;
    // console.log(this.backgroundOptions.y)
  }

  updateInformation() {
    // update score here later
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
    if (this.allMovingObjects.player && !this.player.disabled) {
      const newHealth = this.player.health + 3;
      this.player.health = (newHealth > 10 ? 10 : newHealth);
    }
  }

  setEnemies() {
    if (this.enemiesRemaining === 0) {
      if (this.enemyWave < Game.MAX_ENEMY_WAVE) {
        this.enemyWave += 1;
        this.enemyWaveCount = this.enemyWave * 5;
        this.enemiesRemaining = this.enemyWaveCount;
        this.addedEnemies = 0;
        this.healPlayer();
      } else if (!this.bossFight) {
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
        // might change to increment difficulty per wave
        const randPosX = Math.floor(Math.random() * this.canvasWidth);
        // const randSpeed = Math.floor(Math.random() * (5 - 2) + 2);
        const randSpeed = Math.random() * (5 - 2) + 2;
        const randCooldown = Math.floor(Math.random() * (1000 - 450) + 450);
        const newEnemy = new EnemyShip(this, randPosX, randSpeed, randCooldown);
        this.allMovingObjects.enemies.push(newEnemy);
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
    if (this.allMovingObjects.projectiles.length === 0) {
      this.boss = new Boss(this);
      this.switchGameInformation();
      this.allMovingObjects.enemies.push(this.boss);
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
    this.win = true;
  }

  setGameOver() {
    this.player.removeControlHandlers();
    this.gameOver = true;
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
      if (this.gameOver || this.win) setTimeout(this.drawRetryKey.bind(this, ctx), 1000);
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
    event.preventDefault();
    if (event.key) {
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
    event.preventDefault();
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
    this.enemyWave = 0;
    this.addEnemyOnCooldown = true;
    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.startScreen = false;
    this.player = new PlayerShip(this);
    this.allMovingObjects = {
      player: this.player,
      enemies: [],
      projectiles: [],
      particles: []
    };

    const bossInfo = document.getElementById("boss-info");
    bossInfo.style.display = "none";
    this.bossFight = false;
    
    const waveInfo = document.getElementById("wave-info");
    waveInfo.style.display = "flex";
  }
}

export default Game;