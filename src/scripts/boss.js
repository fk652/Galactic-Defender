// The big bad boss, the final enemy in a level
// Defeat the boss to win and save the galaxy!

import Ship from "./ship";
import Explosion from "./explosion";
import Timer from "./timer";

class Boss extends Ship {
  static MAX_HEALTH = 50;

  constructor(game) {
    // Ship/Moving Object related arguments
    let image = document.createElement("img");
    image.src = "src/assets/images/boss1.png";
    let height = 220;
    let width = 250
    let health = Boss.MAX_HEALTH;
    let projectileDmg = 2;

    const objArgs = {
      width: width,
      height: height,
      position: [(game.canvasWidth/2) - (width/2), 0 - (height*2)],
      velocity: [0, 1],
      speed: 1,
      health: health,
      game: game,
      image: image,
      type: "enemies"
    }

    // Projectile related arguments
    image = document.createElement("img");
    image.src = "src/assets/images/enemy_projectile.png";
    const projectileArgs = [{
      objArgs: {
        velocity: [0, 8],
        speed: 8,
        health: projectileDmg,
        game: game,
        width: 10,
        height: 40,
        image: image
      },
      type: "bullet",
      origin: "enemy",
      projectileSound: "bossProjectile"
    }]

    // boss projectile patterns, to be activated based on boss phase
    const patternArgs = [{
      positionDeltas: [[18, 200], [width-32, 200]],
      batchFireNum: 1,
      batchFireInterval: 0,
      cooldown: 1000,
      onCooldown: true,
      timer: null,
      projectileArgIndex: 0
    },
    {
      positionDeltas: [[60, 210], [width-76, 210]],
      batchFireNum: 2,
      batchFireInterval: 150,
      cooldown: 2000,
      onCooldown: true,
      timer: null,
      projectileArgIndex: 0
    },
    {
      positionDeltas: [[75, 180], [width-88, 180]],
      batchFireNum: 2,
      batchFireInterval: 150,
      cooldown: 1000,
      onCooldown: true,
      timer: null,
      projectileArgIndex: 0
    },
    {
      positionDeltas: [[100, 160], [width - 110, 160]],
      batchFireNum: 3,
      batchFireInterval: 150,
      cooldown: 2000,
      onCooldown: true,
      timer: null,
      projectileArgIndex: 0
    }]

    super(objArgs, projectileArgs, patternArgs);
  }

  // box1 is the weakspot
  getHitbox() {
    const box1 = {
      x: this.position[0] + 85,
      y: this.position[1] + 90,
      width: 80,
      height: 70
    }

    const box2 = {
      x: this.position[0] + 10,
      y: this.position[1] + 90,
      width: (this.width - 100) / 2,
      height: this.height - 110
    }

    const box3 = {
      x: this.position[0] + 165,
      y: this.position[1] + 90,
      width: (this.width - 100) / 2,
      height: this.height - 110
    }

    const box4 = {
      x: this.position[0] + 45,
      y: this.position[1] + 30,
      width: 155,
      height: 60
    }

    return [box1, box2, box3, box4];
  }

  // only takes damage if weakpoint hit (index 0 is the hitbox1 weakpoint)
  // takes in the colliding MovingObject and an array of hitbox collision positions as [[int, int]]
  handleCollided(otherObj, hitboxesCollided) {
    const otherObjClass = otherObj.constructor.name;

    if (otherObjClass === "Projectile") {
      if (hitboxesCollided.includes(0)) {
        const damage = otherObj.health;
        this.damageTaken(damage);
      }
      otherObj.remove();
    }
  }

  // Boss will slowly move down center from the top during cutscene
  // then move side to side throughout the fight at normal speed 
  updateVelocity() {
    if (this.movementDisabled) return 

    if (this.position[1] > 0) {
      this.speed = 1.5;
      if (this.velocity[0] === 0 || this.position[0] < 0) {
        if (this.velocity[0] === 0) {
          new Timer(this.game, this.resetCooldown.bind(this, 0), 1250)
          this.game.sounds.switchBGM("bossBGM");
          this.game.player.disabled = false;
        }
        this.velocity = [this.speed, 0];
      } else if (this.position[0] > this.game.canvasWidth - this.width) {
        this.velocity = [-this.speed, 0];
      }
    }
  }

  // Boss shooting patterns updated based on health remaining
  updateShootingPattern() {
    if (this.health === 20) {
      this.patternArgs[0].timer?.clear();
      this.patternArgs[1].timer?.clear();
      this.patternArgs[2].timer?.clear();
      this.patternArgs[0].onCooldown = false;
      this.patternArgs[1].onCooldown = false;
      this.patternArgs[2].onCooldown = false;
      this.patternArgs[3].onCooldown = false;
    } else if (this.health === 30) {
      this.patternArgs[0].timer?.clear();
      this.patternArgs[1].timer?.clear();
      this.patternArgs[0].onCooldown = false;
      this.patternArgs[1].onCooldown = false;
      this.patternArgs[2].onCooldown = false;
    } else if (this.health === 40) {
      this.patternArgs[0].timer?.clear();
      this.patternArgs[0].onCooldown = false;
      this.patternArgs[1].onCooldown = false;
    }
  }

  shootProjectile() {
    if (!this.disabled) super.shootProjectile();
  }

  damageTaken(damage) {
    if (!this.disabled) {
      super.damageTaken(damage);
      this.updateShootingPattern();
    }
  }

  // Boss death animations plays alot of minor explosions and ends with big finale explosion
  // Then proceeds to game win after a delay
  remove() {
    this.game.score += 1000;
    this.disabled = true;

    // minor explosions
    for (let i = 0; i < 20; i++) {
      const timeDelay = i * 200;
      if (i % 2 === 0) new Timer(this.game, () => this.game.sounds.add("explosion"), timeDelay);

      new Timer(this.game, () => {
        const hitBoxes = this.getHitbox();
        const randHitBox = hitBoxes[i % hitBoxes.length]
        const randPosX = Math.floor(Math.random() * ((randHitBox.x + randHitBox.width) - randHitBox.x) + randHitBox.x);
        const randPosY = Math.floor(Math.random() * ((randHitBox.y + randHitBox.height) - randHitBox.y) + randHitBox.y);
        const dx = (this.velocity[0] < 0 ? 30 : 10)
        new Explosion(this.game, 80, [randPosX - dx, randPosY - 70], "minor", [0, 0.1]);
      }, timeDelay);
    }

    // stop for final explosion
    new Timer(this.game, () => {
      this.velocity = [0,0];
      this.speed = 0;
      this.movementDisabled = true;
    }, 4000);
    
    // final explosion and start timer for setting game win
    new Timer(this.game, () => {
      this.game.sounds.playMajorSound("bossDeath");
      const multiplier = (this.velocity[0] < 0 ? 1 : -1);
      const posX = this.position[0]-(this.width/2);
      const posY = this.position[1]-(this.height/1.5);
      new Explosion(this.game, 500, [posX - 30, posY], "major", [0, 0]);
      super.remove();

      new Timer(this.game, this.game.setWin.bind(this.game), 3500);
    }, 4500)
  }
}

export default Boss;