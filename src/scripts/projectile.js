import MovingObject from "./moving_object";

class Projectile extends MovingObject {
  constructor(args, origin) {
    super(args);
    this.origin = origin;
  }

  move() {
    const newY = this.position[1] + this.velocity[1];

    // collision against enemy logic here?

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