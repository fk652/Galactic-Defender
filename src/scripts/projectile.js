import MovingObject from "./moving_object";

class Projectile extends MovingObject {
  constructor(args) {
    super(args.objArgs);
    this.origin = args.origin; // for collision logic later
  }

  // move() {
  //   const newPos = this.position;
  //   newPos[0] += this.velocity[0];
  //   newPos[1] += this.velocity[1];

  //   // collision against enemy/player logic here?
  //   // create seperate collision checking function in game class

  //   if (!this.inBounds(newPos)) {
  //     const projectiles = this.game.allMovingObjects.projectiles;
  //     // projectiles.splice(projectiles.indexOf(this), 1);
  //     projectiles[projectiles.indexOf(this)] = null;
  //   } else {
  //     this.position = newPos
  //   }
  // }

  move(timeDelta) {
    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.velocity[0] * velocityScale;
    const offsetY = this.velocity[1] * velocityScale;

    const newPos = this.position;
    newPos[0] += offsetX;
    newPos[1] += offsetY;

    // collision against enemy/player logic here?
    // create seperate collision checking function in game class

    if (!this.inBounds(newPos)) {
      this.remove();
      // const projectiles = this.game.allMovingObjects.projectiles;
      // projectiles[projectiles.indexOf(this)] = null;
    } else {
      this.position = newPos
    }
  }

  inBounds(position) {
    const [x, y] = position;
    return (x > -this.width 
      && x < this.game.canvasWidth + this.width
      && y > -this.height 
      && y < this.game.canvasHeight + this.height)
  }

  remove() {
    const projectiles = this.game.allMovingObjects.projectiles;
    projectiles[projectiles.indexOf(this)] = null;
  }
}

export default Projectile;