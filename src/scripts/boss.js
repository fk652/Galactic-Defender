import Ship from "./ship";
import Projectile from "./projectile";
import Explosion from "./explosion";
import { rectangleCollision } from "./utils";

class Boss extends Ship {
  static MAX_HEALTH = 20;

  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/images/boss1.png";
    let height = 220;
    let width = 250
    let health = Boss.MAX_HEALTH;
    // let health = 1;
    const objArgs = {
      width: width,
      height: height,
      position: [(game.canvasWidth/2) - (width/2), 0 - (height*2)],
      velocity: [0, 1],
      // velocity: [0, 5],
      speed: 1,
      health: health,
      game: game,
      image: image,
      type: "enemies"
    }

    image = document.createElement("img");
    image.src = "src/assets/images/enemy_projectile.png";
    const projectileArgs = [{
      objArgs: {
        velocity: [0, 8],
        speed: 8,
        health: 2,
        game: game,
        width: 10,
        height: 40,
        image: image
      },
      type: "bullet",
      origin: "enemy",
      projectileSound: "bossProjectile"
    }]

    const patternArgs = [{
      positionDeltas: [[18, 200], [width-32, 200]],
      batchFireNum: 1,
      batchFireInterval: 0,
      cooldown: 1000,
      onCooldown: true,
      projectileArgIndex: 0
    },
    {
      positionDeltas: [[60, 210], [width-76, 210]],
      batchFireNum: 1,
      batchFireInterval: 0,
      cooldown: 1000,
      onCooldown: true,
      projectileArgIndex: 0
    },
    {
      positionDeltas: [[75, 180], [width-88, 180]],
      batchFireNum: 1,
      batchFireInterval: 0,
      cooldown: 1000,
      onCooldown: true,
      projectileArgIndex: 0
    },
    {
      positionDeltas: [[100, 160], [width - 110, 160]],
      batchFireNum: 1,
      batchFireInterval: 0,
      cooldown: 1000,
      onCooldown: true,
      projectileArgIndex: 0
    }]

    super(objArgs, projectileArgs, patternArgs);
  }

  getHitbox() {
    // weakspot
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

  updateVelocity() {
    if (this.position[1] > 0) {
      this.speed = 1.5;
      if (this.velocity[0] === 0 || this.position[0] < 0) {
        if (this.velocity[0] === 0) {
          setTimeout(this.resetCooldown.bind(this, 0), 1250)
          this.game.sounds.switchBGM("bossBGM");
          this.game.player.disabled = false;
        }
        this.velocity = [this.speed, 0];
      } else if (this.position[0] > this.game.canvasWidth - this.width) {
        this.velocity = [-this.speed, 0];
      }
    }
  }

  updateShootingPattern() {
    if (this.health === 10) {
      this.patternArgs[3].onCooldown = false;
    } else if (this.health === 15) {
      this.patternArgs[2].onCooldown = false;
    } else if (this.health === 18) {
      this.patternArgs[1].onCooldown = false;
    }
  }

  damageTaken(damage) {
    if (!this.disabled) {
      super.damageTaken(damage);
      this.updateShootingPattern();
    }
  }

  remove() {
    this.game.score += 1000;
    this.disabled = true;

    for (let i = 0; i < 20; i++) {
      if (i % 4 === 0) setTimeout(() => this.game.sounds.add("explosion"), 300 * (i/4));
      const randTime = Math.floor(Math.random() * (1200 - 100) + 100);
      setTimeout(() => {
        const hitBoxes = this.getHitbox();
        const randHitBox = hitBoxes[Math.floor(Math.random()*hitBoxes.length)]
        const randPosX = Math.floor(Math.random() * ((randHitBox.x + randHitBox.width) - randHitBox.x) + randHitBox.x);
        const randPosY = Math.floor(Math.random() * ((randHitBox.y + randHitBox.height) - randHitBox.y) + randHitBox.y);
        const dx = (this.velocity[0] < 0 ? 30 : 10)
        new Explosion(this.game, 80, [randPosX - dx, randPosY - 70], "minor", [0, 0.1]);
      }, randTime);
    }
    
    setTimeout(() => {
      this.game.sounds.playBossDeathSound();
      const multiplier = (this.velocity[0] < 0 ? 1 : -1);
      const posX = this.position[0]-(this.width/2);
      const posY = this.position[1]-(this.height/1.5);
      new Explosion(this.game, 500, [posX - 30, posY], "major", [0, 0]);
      super.remove();

      setTimeout(this.game.setWin.bind(this.game), 2500);
    }, 1500)
  }
}

export default Boss;