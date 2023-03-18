import MovingObject from "./moving_object";

class Projectile extends MovingObject {
  constructor(args) {
    args.objArgs.type = "projectiles";
    super(args.objArgs);
    this.origin = args.origin;
  }

  handleBounds(newPosition) {
    if (!this.inBounds(newPosition)) {
      super.remove();
    } else {
      this.position = newPosition
    }
  }
}

export default Projectile;