import Ship from "./ship";

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
  }

  updateVelocity() {
    if (this.position[1] > 0) {
      // const randSpeed = Math.random() * (0.005 - 0.003) + 0.003;
      const speed = this.determineSpeed();
      if (this.velocity[0] === 0 || this.position[0] < 0) {
        this.velocity = [speed, 0];
      } else if (this.position[0] > this.game.canvasWidth - this.width) {
        this.velocity = [-speed, 0]
      }
    }

    // if (this.position[1] > 0) {
    //   this.velocity = [0, 0];
    // }
  }

  move() {
    this.updateVelocity();
    this.position = [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];

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
}

export default Boss;