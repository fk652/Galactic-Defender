// Top level class for all projectiles shot from ships

import MovingObject from "./moving_object";

class Projectile extends MovingObject {
  // args contains MovingObject args and an origin
  constructor(args) {
    // Projectile health determines damage dealt
    args.objArgs.type = "projectiles";
    super(args.objArgs);
    this.origin = args.origin;  // a string of either 'player' or 'enemy'
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