import Ship from "./ship";
import Projectile from "./projectile";
import MovingObject from "./moving_object";

class Boss extends Ship {
  constructor(game) {
    let image = document.createElement("img");
    // image.src = "src/assets/boss1.png";
    image.src = "src/assets/boss1.png";
    let height = 200;
    let width = game.canvasWidth/2;
    let health = 100;

    const objArgs = {
      width: width,
      height: height,
      position: [(game.canvasWidth/2) - (width/2), 0 - height],
      // velocity: [0, 1],
      velocity: [0, 5],
      health: health,
      game: game,
      image: image
    }

    image = document.createElement("img");
    image.src = "src/assets/enemy_projectile.png";

    const projectileArgs = {
      objArgs: {
        velocity: [0, 8],
        health: 1,
        game: game,
        width: 10,
        height: 40,
        image: image
      },
      origin: "enemy",
      cooldown: 250,
      xAdjustment: .45,
      yAdjustment: 0
    }

    super(objArgs, projectileArgs);

    this.shootOnCooldown = true;

    // array of dx, dy
    // add seperate cooldowns for each pattern later
    this.projectilePositions = [
      // [2, 82],
      // [width-14, 82]
    ]
  }

  getHitbox() {
    // return super.getHitbox()

    // weakspot
    const box1 = {
      x: this.position[0] + (this.width / 2.5),
      y: this.position[1],
      width: this.width / 4.5,
      height: this.height / 1.8
    }

    const box2 = {
      x: this.position[0] + (this.width / 3.75),
      y: this.position[1],
      width: this.width / 8.5,
      height: this.height / 1.2
    }

    const box3 = {
      x: this.position[0] + (this.width / 1.6),
      y: this.position[1],
      width: this.width / 8,
      height: this.height / 1.2
    }

    const box4 = {
      x: this.position[0] + (this.width/80),
      y: this.position[1] + (this.height/4),
      width: this.width / 4,
      height: this.height / 8.5
    }

    const box5 = {
      x: this.position[0] + (this.width/1.3),
      y: this.position[1] + (this.height/4),
      width: this.width / 4.5,
      height: this.height / 8.5
    }

    return [box1, box2, box3, box4, box5];
    // return [box1]
  }

  collideCheck(otherObj) {
    const thisHitboxes = this.getHitbox();
    const otherHitboxes = otherObj.getHitbox();

    let hitboxesCollided = {};
    thisHitboxes.forEach((thisBox, idx) => {
      hitboxesCollided[idx] = false;
      return otherHitboxes.forEach((otherBox) => {
        if (this.rectangleCollision(thisBox, otherBox)) {
          hitboxesCollided[idx] = true;
        }
      })
    })

    if (Object.values(hitboxesCollided).some((found => found))) {
      this.handleCollided(otherObj, hitboxesCollided);
    }
  }

  handleCollided(otherObj, hitboxesCollided) {
    const otherObjClass = otherObj.constructor.name;

    if (otherObjClass === "Projectile") {
      // console.log("projectile collision");
      const damage = otherObj.health;
      otherObj.remove();
      if (hitboxesCollided[0]) this.damageTaken(damage);
      console.log(this.health);
    }
  }


  updateVelocity() {
    // if (this.position[1] > 0) {
    //   // const randSpeed = Math.random() * (0.005 - 0.003) + 0.003;
    //   const speed = this.determineSpeed();
    //   // const speed = 1;
    //   if (this.velocity[0] === 0 || this.position[0] < 0) {
    //     if (this.velocity[0] === 0) {
    //       this.shootOnCooldown = false;
    //       this.game.player.disabled = false;
    //     }
    //     this.velocity = [speed, 0];
    //   } else if (this.position[0] > this.game.canvasWidth - this.width) {
    //     this.velocity = [-speed, 0];
    //   }
    // }

    // for testing purposes, make boss stationary
    if (this.position[1] > 0) {
      this.position[1] = 0;
      if (this.velocity[1] !== 0) {
        this.shootOnCooldown = false;
        this.game.player.disabled = false;
      }
      this.velocity = [0, 0];
    }
  }

  // move() {
  //   // this.updateShootingPattern(); // do this when taking damage
  //   // console.log(this.position);
  //   const newPos = this.position;
  //   newPos[0] += this.velocity[0];
  //   newPos[1] += this.velocity[1];
  //   this.position = newPos;
  //   this.updateVelocity();

  //   // collision against enemy/player logic here?
  //   // create seperate collision checking function in game class
  //   if (!this.shootOnCooldown) {
  //     this.shootProjectile();
  //     this.shootOnCooldown = true;
  //     setTimeout(this.resetCooldown.bind(this), this.cooldown);
  //   }
  // }

  move(timeDelta) {
    this.updateVelocity();
    this.updateShootingPattern();

    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.velocity[0] * velocityScale;
    const offsetY = this.velocity[1] * velocityScale;

    // console.log([
    //   this.velocity,
    //   offsetX,
    //   offsetY,
    //   this.position[0]
    // ])

    // this.updateShootingPattern(); // do this when taking damage
    // console.log(this.position);
    const newPos = this.position;
    newPos[0] += offsetX;
    newPos[1] += offsetY;
    this.position = newPos;

    // collision against enemy/player logic here?
    // create seperate collision checking function in game class
    if (!this.shootOnCooldown) {
      this.shootProjectile();
      this.shootOnCooldown = true;
      setTimeout(this.resetCooldown.bind(this), this.cooldown);
    }
  }

  determineSpeed() {
    if (this.health > 70) {
      return 1;
    } else if (this.health > 40) {
      return 1.5;
    } else if (this.health <= 10) {
      return 2;
    }
  }

  updateShootingPattern() {
    // add seperate cooldowns for each pattern later
    if (this.health < 10) {
      this.projectilePositions = [
        [2, 82],[this.width-14, 82],
        [22, 80],[this.width-34, 80],
        [52, 85],[this.width-64, 85],
        [(this.width/2) - 45, this.height-5],
        [(this.width/2) + 33, this.height-5]
        //add one more later
      ];
    } else if (this.health < 40) {
      this.projectilePositions = [
        [2, 82],[this.width-14, 82],
        [22, 80],[this.width-34, 80],
        [52, 85],[this.width-64, 85]
      ];
    } else if (this.health < 70) {
      this.projectilePositions = [
        [2, 82],[this.width-14, 82],
        [22, 80],[this.width-34, 80]
      ];
    }
  }

  shootProjectile() {
    if (!this.shootOnCooldown) {
      this.projectilePositions.forEach((pos) => {
        const copy = structuredClone(this.position);
        const projPos = [copy[0] + pos[0], copy[1] + pos[1]]
        this.projectileArgs.objArgs.position = projPos;
        const projectile = new Projectile(this.projectileArgs);
        this.game.allMovingObjects.projectiles.push(projectile);
      })
    }
  }

  damageTaken(damage) {
    super.damageTaken(damage);

    if (this.health <= 0) {
      this.game.score += 1000;
      this.remove()
      // activate game over win logic here
    }
  }

  remove() {
    const enemies = this.game.allMovingObjects.enemies;
    enemies[enemies.indexOf(this)] = null;
    // enemies.splice(enemies.indexOf(this), 1);
  }
}

export default Boss;