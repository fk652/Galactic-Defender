import Ship from "./ship";
import Projectile from "./projectile";
import MovingObject from "./moving_object";
import Explosion from "./explosion";
import Explosion2 from "./explosion2";

class Boss extends Ship {
  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/boss1.png";
    let height = 220;
    // let width = game.canvasWidth/2;
    let width = 250
    let health = 20;
    // let health = 1;

    const objArgs = {
      width: width,
      height: height,
      position: [(game.canvasWidth/2) - (width/2), 0 - (height*2)],
      velocity: [0, 1],
      // velocity: [0, 5],
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
      cooldown: 1000,
      xAdjustment: .45,
      yAdjustment: 0
    }

    super(objArgs, projectileArgs);

    this.shootOnCooldown = true;

    // maybe add a disabled flag
    this.disabled = false;

    this.pattern1 = [[18, 200], [width-32, 200]];
    this.pattern1Cooldown = 1000;
    this.pattern1OnCooldown = true;
    this.pattern2 = [[60, 210], [this.width-76, 210]];
    this.pattern2Cooldown = 1000;
    this.pattern2OnCooldown = false;
    this.pattern3 = [[75, 180], [this.width-88, 180]];
    this.pattern3Cooldown = 1000;
    this.pattern3OnCooldown = false;
    this.pattern4 = [[100, 160], [this.width - 110, 160]];
    this.pattern4Cooldown = 1000;
    this.pattern4OnCooldown = false;

    // array of dx, dy
    // add seperate cooldowns for each pattern later
    this.projectilePositions = [
      ...this.pattern1
    ]

    this.projectileSound = "bossProjectile";
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
      const damage = otherObj.health;
      otherObj.remove();
      if (hitboxesCollided[0]) this.damageTaken(damage);
    }
  }


  updateVelocity() {
    if (this.position[1] > 0) {
      const speed = 1.5;
      if (this.velocity[0] === 0 || this.position[0] < 0) {
        if (this.velocity[0] === 0) {
          setTimeout(this.resetCooldown.bind(this), 1250)
          this.game.sounds.switchBGM("bossBGM");
          this.game.player.disabled = false;
          this.game.healPlayer();
        }
        this.velocity = [speed, 0];
      } else if (this.position[0] > this.game.canvasWidth - this.width) {
        this.velocity = [-speed, 0];
      }
    }

    // for testing purposes, make boss stationary
    // if (this.position[1] > 0) {
    //   // this.position[1] = 0;
    //   // this.disabled = true;
    //   if (this.velocity[1] !== 0) {
    //     // this.shootOnCooldown = false;
    //     setTimeout(this.resetCooldown.bind(this), 1000)
    //     this.game.player.disabled = false;
    //   }
    //   this.velocity = [0, 0];
    // }
  }

  // draw() {
  //   var c = document.getElementById("game-view");
  //   var ctx = c.getContext("2d");
  //   super.draw(ctx);

  //   const box1 = {
  //     x: this.position[0] + 85,
  //     y: this.position[1] + 90,
  //     width: 80,
  //     height: 70
  //   }
  //   ctx.beginPath();
  //   ctx.rect(box1.x, box1.y, box1.width, box1.height);
  //   ctx.strokeStyle = "red";
  //   ctx.stroke();

  //   ctx.beginPath();
  //   const box2 = {
  //     x: this.position[0] + 10,
  //     y: this.position[1] + 90,
  //     width: (this.width - 100) / 2,
  //     height: this.height - 110
  //   }
  //   ctx.rect(box2.x, box2.y, box2.width, box2.height);
  //   ctx.strokeStyle = "red";
  //   ctx.stroke();

  //   const box3 = {
  //     x: this.position[0] + 165,
  //     y: this.position[1] + 90,
  //     width: (this.width - 100) / 2,
  //     height: this.height - 110
  //   }
  //   ctx.beginPath();
  //   ctx.rect(box3.x, box3.y, box3.width, box3.height);
  //   ctx.strokeStyle = "red";
  //   ctx.stroke();

  //   const box4 = {
  //     x: this.position[0] + 45,
  //     y: this.position[1] + 30,
  //     width: 155,
  //     height: 60
  //   }
  //   ctx.beginPath();
  //   ctx.rect(box4.x, box4.y, box4.width, box4.height);
  //   ctx.strokeStyle = "red";
  //   ctx.stroke();
  // }

  move(timeDelta) {
      this.updateVelocity();
      this.updateShootingPattern();

      const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
      const offsetX = this.velocity[0] * velocityScale;
      const offsetY = this.velocity[1] * velocityScale;

      const newPos = this.position;
      newPos[0] += offsetX;
      newPos[1] += offsetY;
      this.position = newPos;

    if (!this.disabled) {
      if (!this.shootOnCooldown) {
        this.shootProjectile();
        this.game.sounds.add(this.projectileSound);
        this.shootOnCooldown = true;
        setTimeout(this.resetCooldown.bind(this), this.cooldown);
      }
      if (!this.pattern1OnCooldown) {

      }
      if (!this.pattern2OnCooldown && this.health < 20) {

      }
      if (!this.pattern3OnCooldown && this.health < 15) {

      }
      if (!this.pattern4OnCooldown && this.health < 10) {

      }
    }
  }

  shootProjectile() { //update this to handle different pattern
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

  // resetCooldown(patternNum) {
  //   this[`pattern${patternNum}OnCooldown`] = false;
  // }

  updateShootingPattern() {
    if (this.health < 10) {
      this.projectilePositions = [
        ...this.pattern1,
        ...this.pattern2,
        ...this.pattern3,
        ...this.pattern4
      ];
    } else if (this.health < 15) {
      this.projectilePositions = [
        ...this.pattern1,
        ...this.pattern2,
        ...this.pattern3
      ];
    } else if (this.health < 20) {
      this.projectilePositions = [
        ...this.pattern1,
        ...this.pattern2
      ];
    }
  }

  damageTaken(damage) {
    if (!this.disabled) {
      super.damageTaken(damage);

      if (this.health <= 0) {
        this.game.score += 1000;
        this.disabled = true;

        // const hitBoxes = this.getHitbox();
        // hitBoxes.forEach((hitbox) => {
        //   for (let i = 0; i < 10; i++) {
        //     try {
        //       const randPosX = Math.floor(Math.random() * ((hitbox.x + hitbox.width) - hitbox.x)) + hitbox.x;
        //       const randPosY = Math.floor(Math.random() * ((hitbox.y + hitbox.height) - hitbox.y) + hitbox.y);
        //       const randTime = Math.floor(Math.random() * (1000 - 100) + 100);
        //       const explosion = new Explosion(this.game, 80, [randPosX - 100, randPosY - 20]);
        //       explosion.dy = 0.5;
        //       // explosion.dx = (this.velocity[0]/3)
        //       setTimeout(() => {
        //         this.game.allMovingObjects.explosions.push(explosion);
        //       }, randTime);
        //     } catch(error) {
        //       // console.error();
        //       // console.log(this.game);
        //     }
        //   }
        // })

        for (let i = 0; i < 20; i++) {
          try {
            const newX = this.position[0] + this.velocity[0];
            const newY = this.position[1] + this.velocity[1];
            const randPosX = Math.floor(Math.random() * ((newX + this.width) - newX) + newX);
            const randPosY = Math.floor(Math.random() * ((newY + this.height) - newY) + newY);
            const randTime = Math.floor(Math.random() * (1500 - 100) + 100);
            const multiplier = (this.velocity[0] < 0 ? 1 : -1);
            const dx = (this.velocity[0] < 0 ? 70 : 20)
            const explosion = new Explosion(this.game, 80, [randPosX - (dx * multiplier), randPosY - 20]);
            explosion.dy = 0.1;
            explosion.dx = (this.velocity[0]/4) * multiplier;
            explosion.velocity[0] = this.velocity[0];
            this.game.sounds.add("explosion");
            setTimeout(() => {
              this.game.allMovingObjects.explosions.push(explosion);
            }, randTime);
          } catch(error) {
            // console.error();
            // console.log(this.game);
          }
        }
        
        setTimeout(() => {
          this.remove()
          try {
            this.game.sounds.playBossDeathSound();
            const multiplier = (this.velocity[0] < 0 ? 1 : -1);
            const posX = this.position[0]-(this.width/2);
            const posY = this.position[1]-(this.height/1.5);
            const finalExplosion = new Explosion2(this.game, 500, [posX - (20 * multiplier), posY]);
            this.game.allMovingObjects.explosions.push(finalExplosion);
          } catch(error) {
            // console.error();
            // console.log(this.game);
          }
          setTimeout(this.game.setWin.bind(this.game), 2500);
        }, 1500)
      }
    }
  }

  remove() {
    const enemies = this.game.allMovingObjects.enemies;
    enemies[enemies.indexOf(this)] = null;
  }
}

export default Boss;