import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Boss from "./boss";
import Sound from "./sound";
import Timer from "./timer";

class Game {
  static MAX_ENEMY_WAVE = 5;

  constructor(canvas, gameView) {
    this.canvas = canvas;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.gameView = gameView;

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

    this.timers = {};
    
    this.allMovingObjects = {
      player: {},
      enemies: {},
      projectiles: {},
      particles: {},
      explosions: {}
    };

    this.player = new PlayerShip(this);
    this.bossFight = false;
    this.boss = null;
    this.sounds = new Sound(this);
  }

  step(timeDelta) {
    this.checkCollisions();
    this.setEnemies();
    this.moveObjects(timeDelta);
    this.shootProjectiles();
  }

  pauseTimers() {
    Object.values(this.timers).forEach(timer => timer.pause());
  }

  resumeTimers() {
    Object.values(this.timers).forEach(timer => timer.resume());
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

  healPlayer() {
    if (this.allMovingObjects.player && this.player.health > 0) {
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
      new Timer(this, this.resetAddEnemyCooldown.bind(this), randTimeOut);
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
      this.score *= Math.ceil(this.player.health/2) || 1;
      this.healPlayer();
      this.bossFight = true;
      this.gameView.switchGameInformation();
    }
  }

  setWin() {
    if (!this.gameOver) {
      this.score *= this.player.health;
      this.win = true;
      this.sounds.playWinSound();
    }
  }

  setGameOver() {
    if (!this.win) {
      this.gameOver = true;
      this.sounds.playGameOverSound();
    }
  }

  reset() {
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

    this.timers = {};

    this.allMovingObjects = {
      player: {},
      enemies: {},
      projectiles: {},
      particles: {},
      explosions: {}
    };

    this.player = new PlayerShip(this);
    this.boss = null;
    this.bossFight = false;
    this.gameView.switchGameInformation();

    this.sounds.reset();
    this.sounds.switchBGM("waveBGM");
  }
}

export default Game;