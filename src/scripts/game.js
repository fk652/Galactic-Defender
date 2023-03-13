import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Boss from "./boss";

class Game {
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.drawn = false;
    // this.enemyWave = 0;
    this.enemyWave = 8;

    // add a delay to this later after implementing start screen
    // this.addEnemyOnCooldown = true;
    this.addEnemyOnCooldown = true;

    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;

    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.startMenu = true;

    this.player = new PlayerShip(this);
    
    this.allMovingObjects = {
      player: this.player,
      enemies: [],
      projectiles: [],
      particles: []
    };

    // this.boss = new Boss(this);
    const bossInfo = document.getElementById("boss-info");
    bossInfo.style.display = 'none';
    this.bossFight = false;
  }

  step(timeDelta) {
    this.clearNulls();
    this.checkCollisions();
    this.updateInformation();
    this.setEnemies();  // maybe add if else to check for boss fight status or add enemy waves
    this.moveObjects(timeDelta);
  }

  // null vs splicing testing
  clearNulls() {
    for (let key in this.allMovingObjects) {
      const objectsValue = this.allMovingObjects[key]
      if (objectsValue instanceof Array) {
        const filtered = objectsValue.filter(el => el);
        this.allMovingObjects[key] = filtered;
      }
    }
  }

  // moveObjects() {
  //   for (let key in this.allMovingObjects) {
  //     const objectsValue = this.allMovingObjects[key]
  //     if (objectsValue instanceof Array) {
  //       objectsValue.forEach(obj => {
  //         if (obj) obj.move()
  //       });
  //     } else {
  //       if (objectsValue) objectsValue.move();
  //     }
  //   }
  // }

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
    if (type === 'boss') {
      health = Math.ceil(health / 10);
    }

    if (healthBar.children.length < health) {
      for (let i = 0; i < health - healthBar.children.length; i++) {
        healthBar.appendChild(healthPoint);
      }
    } else if ((healthBar.children.length > health)) {
      for (let i = 0; i < healthBar.children.length - health; i++) {
        // console.log(healthBar.lastChild);
        const lastChild = healthBar.lastChild;
        if (lastChild) healthBar.removeChild(healthBar.lastChild);
      }
    }
  }

  healPlayer() {
    // heal player in between rounds (no more than 10)
    // can also heal based on score or enemies killed this round
    if (this.allMovingObjects.player) {
      const newHealth = this.player.health + 3;
      this.player.health = (newHealth > 10 ? 10 : newHealth);
    }
  }

  setEnemies() {
    if (this.enemiesRemaining === 0) {
      if (this.enemyWave < 10) {
        this.enemyWave += 1;
        this.enemyWaveCount = this.enemyWave * 5;
        this.enemiesRemaining = this.enemyWaveCount;
        this.addedEnemies = 0;
        this.healPlayer();

      } else if (!this.bossFight) {
        // might give extra heal before boss
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

        // might change to increment difficulty per wave
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
      this.healPlayer();
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

  // can DRY up setWin and setGameOver
  setWin() {
    this.player.removeControlHandlers();
    this.bindRetryHandler();
    this.win = true;
  }

  setGameOver() {
    this.player.removeControlHandlers();
    this.bindRetryHandler();
    this.gameOver = true;
  }

  // might not be needed
  setPlay() {

  }

  reset() {
    // console.log('resetting');
    this.drawn = false;
    this.enemyWave = 0;
    this.addEnemyOnCooldown = true;
    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.startMenu = false;
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

  drawWin(ctx) {
    // ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.font = "48px roboto";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("YOU WIN!", this.canvasWidth/2, this.canvasHeight/2);
    ctx.font = "24px roboto";
    ctx.fillText("(press any key to retry)", this.canvasWidth/2, this.canvasHeight/2 + 50);
    this.drawn = true;
  }

  drawGameOver(ctx) {
    // ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.font = "48px roboto";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", this.canvasWidth/2, this.canvasHeight/2);
    ctx.font = "24px roboto";
    ctx.fillText("(press any key to retry)", this.canvasWidth/2, this.canvasHeight/2 + 50);
    this.drawn = true;
  }

  drawStartMenu(ctx) {
    // ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.font = "48px roboto";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Press any key to start", this.canvasWidth/2, this.canvasHeight/2);
    this.drawn = true;
  }

  drawMessage(ctx, message) {
    // DRY all draw messages here later
  }

  bindStartHandler() {
    this.startHandler = this.handleStartKey.bind(this);
    document.addEventListener("keypress", this.startHandler);
  }

  // might not be needed
  bindPlayerHandler() {
    this.player.bindControlHandlers();
  }

  handleStartKey(event) {
    event.preventDefault();
    if (event.key) {
      this.startMenu = false;
      document.removeEventListener("keypress", this.startHandler)
      this.bindPlayerHandler();
      setTimeout(this.resetAddEnemyCooldown.bind(this), 3000);
      this.drawn = false;
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
      this.bindPlayerHandler();
      setTimeout(this.resetAddEnemyCooldown.bind(this), 3000);
      this.drawn = false;
    }
  }
}

export default Game;