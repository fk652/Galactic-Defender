import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Boss from "./boss";
import Sound from "./sound";
import Timer from "./timer";

// Game class handles overall game state logic
class Game {
  static MAX_ENEMY_WAVE = 5;

  constructor(canvas, gameView) {
    this.canvas = canvas;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.gameView = gameView;

    this.enemyWave = 0;
    this.addEnemyOnCooldown = true;
    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;

    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.secretEnd = false;
    this.startScreen = true;

    // all moving objects and timers have a unique game id
    this.idCounter = 1;
    this.timers = {};
    this.allMovingObjects = {
      player: {},
      enemies: {},
      projectiles: {},
      explosions: {}
    };

    this.player = new PlayerShip(this);
    this.bossFight = false;
    this.boss = null;

    // all sounds in the game handled with the Sound class
    this.sounds = new Sound(this);
  }

  // apply game logic to determine next state of the game for next animation frame
  step(timeDelta) {
    this.checkCollisions();
    if (!this.bossFight) this.setEnemies();
    this.moveObjects(timeDelta);
    this.shootProjectiles();
  }

  pauseTimers() {
    Object.values(this.timers).forEach(timer => timer.pause());
  }

  resumeTimers() {
    Object.values(this.timers).forEach(timer => timer.resume());
  }

  // call move() for all MovingObject objects
  moveObjects(timeDelta) {
    for (let key in this.allMovingObjects) {
      Object.values(this.allMovingObjects[key]).forEach(obj => obj.move(timeDelta));
    }
  }

  // call shoot() for all Ship objects (player and enemies)
  shootProjectiles() {
    this.player.shootProjectile();
    Object.values(this.allMovingObjects.enemies).forEach(enemy => enemy.shootProjectile());
  }

  // first check projectile collisions, then check player to enemy ship collisions
  checkCollisions() {
    Object.values(this.allMovingObjects.projectiles).forEach(projectile => {
      if (projectile.origin === "player") {
        Object.values(this.allMovingObjects.enemies).forEach(enemy => {
          enemy.collideCheck(projectile);
        })
      } else {
        this.player.collideCheck(projectile);
      }
    })
    
    Object.values(this.allMovingObjects.enemies).forEach(enemy => {
      this.player.collideCheck(enemy);
    })
  }

  // heal player 3hp per round (up to max health)
  healPlayer() {
    if (this.allMovingObjects.player && this.player.health > 0) {
      this.player.health = Math.min(this.player.health + 3, PlayerShip.MAX_HEALTH)
    }
  }

  // next wave if 0 enemies remaining, activate boss fight if last wave finished
    // increased enemies per wave
    // multiply score by remaining player health, and then heal player
  setEnemies() {
    if (this.enemiesRemaining === 0) {
      if (this.enemyWave < Game.MAX_ENEMY_WAVE) {
        this.enemyWave += 1;
        this.enemyWaveCount = this.enemyWave * 5;
        this.enemiesRemaining = this.enemyWaveCount;
        this.addedEnemies = 0;

        if (this.enemyWave > 1) {
          this.score += (this.player.health * 100);
          this.healPlayer();
        }
      } else {
        this.setBoss();
      }
    }

    // throught a wave, enemies are placed in clusters of 3 to 10 at different intervals
    if (!this.addEnemyOnCooldown) {
      const remaining = this.enemyWaveCount - this.addedEnemies;

      let numNewEnemies;
      if (remaining < 10) {
        numNewEnemies = remaining;
      } else {
        numNewEnemies = Math.floor(Math.random() * (10 - 3) + 3);
      }
      this.addedEnemies += numNewEnemies;

      // randomize position, speed, and shoot cooldown for each enemy
      for (let i = 0; i < numNewEnemies; i++) {
        const randPosX = Math.floor(Math.random() * this.canvasWidth);
        const randSpeed = Math.random() * (5 - 2) + 2;
        const randCooldown = Math.floor(Math.random() * (1000 - 450) + 450);
        new EnemyShip(this, randPosX, randSpeed, randCooldown);
      }

      // set cooldown before adding next group of enemies, reset flag in 1 to 3 seconds
      this.addEnemyOnCooldown = true;
      const randTimeOut = Math.random() * (3000 - 1000) + 1000;
      new Timer(this, this.resetAddEnemyCooldown.bind(this), randTimeOut);
    }
  }

  resetAddEnemyCooldown() {
    this.addEnemyOnCooldown = false;
  }

  // waits for all player projectiles to clear, and temporarily disable player (for cutscene to play) 
  // also heal player and update score
  setBoss() {
    this.player.disabled = true;
    if (Object.values(this.allMovingObjects.projectiles).length === 0) {
      this.sounds.switchBGM("bossIncomingBGM");
      this.boss = new Boss(this);
      this.score += (this.player.health * 100);
      this.healPlayer();
      this.bossFight = true;
      this.gameView.switchGameInformation();
    }
  }

  setWin() {
    if (this.player?.health <= 0) this.secretEnd = true;

    if (!this.gameOver) {
      this.score += (this.player.health * 200);
      this.win = true;
      this.sounds.playMajorSound("win");
    }
  }

  setGameOver() {
    if (this.boss?.health <= 0) {
      this.secretEnd = true;
    } else if (!this.win) {
      this.gameOver = true;
      this.sounds.playMajorSound("gameOver");
    }
  }

  reset() {
    this.enemyWave = 0;
    this.addEnemyOnCooldown = true;
    this.addedEnemies = 0;
    this.enemiesRemaining = 0;
    this.enemyWaveCount = 0;
    this.score = 0;
    
    this.gameOver = false;
    this.win = false;
    this.secretEnd = false;
    this.startScreen = false;
    
    for (const id in this.timers) delete this.timers[id];
    for (const type in this.allMovingObjects) {
      for (const id in this.allMovingObjects[type]) {
        delete this.allMovingObjects[type][id];
      }
    }
    this.idCounter = 1;

    this.player = new PlayerShip(this);
    this.boss = null;
    this.bossFight = false;
    this.gameView.switchGameInformation();

    this.sounds.reset();
  }
}

export default Game;