import MovingObject from "./moving_object";

class Projectile extends MovingObject {
  constructor(args, origin) {
    super(args);
    this.origin = origin; // for collision logic later
  }

  move() {
    const newY = this.position[1] + this.velocity[1];

    // collision against enemy/player logic here?
    // create seperate collision checking function in game class

    if (!this.inYBounds(newY)) {
      const projectiles = this.game.allMovingObjects.projectiles;
      projectiles.splice(projectiles.indexOf(this), 1);
    } else {
      this.position = [this.position[0], newY]
    }
  }

  inYBounds(y) {
    return (y >= 0 - this.height && y <= this.game.canvasHeight + this.height);
  }
}

export default Projectile;