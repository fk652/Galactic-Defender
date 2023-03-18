import MovingObject from "./moving_object";
import Projectile from "./projectile";

class Ship extends MovingObject {
  constructor(objArgs, projectileArgs) {
    super(objArgs);
    this.projectileArgs = projectileArgs;
    this.cooldown = projectileArgs.cooldown;
    this.shootOnCooldown = false;
    this.projectileSound = projectileArgs.projectileSound;
  }

  shootProjectile() {
    if (!this.shootOnCooldown && this.inBounds(this.position)) {
      const [dx, dy] = this.projectileArgs.adjustments;
      const startPosition = [this.position[0] + this.width/(2+dx), this.position[1] + dy];
      this.projectileArgs.objArgs.position = startPosition;
      const projectile = new Projectile(this.projectileArgs);
      this.game.allMovingObjects.projectiles[projectile.id] = projectile;
      this.shootOnCooldown = true;
      setTimeout(this.resetCooldown.bind(this), this.cooldown);
      this.playShootSound();
    }
  }

  playShootSound() {
    this.game.sounds.add(this.projectileSound);
  }

  resetCooldown() {
    this.shootOnCooldown = false;
  }

  damageTaken(damage) {
    this.health -= damage;
    if (this.health <= 0) this.remove();
  }
}

export default Ship;