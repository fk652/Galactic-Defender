import MovingObject from "./moving_object";

class Projectile extends MovingObject {
  // Projectile health determines damage dealt
  constructor(args) {
    args.objArgs.type = "projectiles";
    super(args.objArgs);
    this.origin = args.origin;
  }

  // projectiles are also removed when they collide with ships, handled by Ship objects
  handleBounds(newPosition) {
    if (!this.inBounds(newPosition)) {
      super.remove();
    } else {
      this.position = newPosition
    }
  }
}

export default Projectile;