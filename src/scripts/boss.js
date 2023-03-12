import Ship from "./ship";
import Projectile from "./projectile";

class Boss extends Ship {
  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/boss1.png";
    let height = 200;
    let width = game.canvasWidth/2;
    let health = 100;

    const objArgs = {
      width: width,
      height: height,
      position: [(game.canvasWidth/2) - (width/2), 0 - height],
      velocity: [0, .01],
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
      cooldown: 250,
      xAdjustment: .45,
      yAdjustment: 0
    }

    super(objArgs, projectileArgs);

    this.shootOnCooldown = true;

    // array of dx, dy
    this.projectilePositions = [
      [2, 82],
      [width-14, 82]
    ]
  }

  updateVelocity() {
    // if (this.position[1] > 0) {
    //   // const randSpeed = Math.random() * (0.005 - 0.003) + 0.003;
    //   const speed = this.determineSpeed();
    //   // const speed = 1;
    //   if (this.velocity[0] === 0 || this.position[0] < 0) {
    //     if (this.velocity[0] === 0) this.shootOnCooldown = false;
    //     this.velocity = [speed, 0];
    //   } else if (this.position[0] > this.game.canvasWidth - this.width) {
    //     this.velocity = [-speed, 0];
    //   }
    // }

    if (this.position[1] > 0) {
      if (this.velocity[1] !== 0) {
        this.shootOnCooldown = false;
      }
      this.velocity = [0, 0];
    }
  }

  move() {
    // this.updateShootingPattern(); // do this when taking damage
    // console.log(this.position);
    const newPos = this.position;
    newPos[0] += this.velocity[0];
    newPos[1] += this.velocity[1];
    this.position = newPos;
    this.updateVelocity();

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
      return 0.003;
    } else if (this.health > 40) {
      return 0.005;
    } else if (this.health <= 10) {
      return 0.008;
    }
  }

  updateShootingPattern() {
    if (this.health < 10) {
      this.projectilePositions = [
        [2, 82],[width-14, 82],
        [22, 80],[width-34, 80],
        [52, 85],[width-64, 85]
        //add one more later
      ];
    } else if (this.health < 40) {
      this.projectilePositions = [
        [2, 82],[width-14, 82],
        [22, 80],[width-34, 80],
        [52, 85],[width-64, 85]
      ];
    } else if (this.health < 70) {
      this.projectilePositions = [
        [2, 82],[width-14, 82],
        [22, 80],[width-34, 80]
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
}

export default Boss;