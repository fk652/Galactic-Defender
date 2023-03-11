import MovingObject from "./moving_object";
import Projectile from "./projectile";

class Ship extends MovingObject {
  constructor(objArgs, projectileArgs) {
    super(objArgs);
    this.projectileArgs = projectileArgs;
    this.cooldown = projectileArgs.cooldown;
    this.shootOnCooldown = false;
  }

  shootProjectile() {
    const dx = this.projectileArgs.xAdjustment;
    const dy = this.projectileArgs.yAdjustment;
    this.projectileArgs.objArgs.position = [this.position[0] + this.width/(2+dx), this.position[1] + dy];
    const projectile = new Projectile(this.projectileArgs);
    this.game.allMovingObjects.projectiles.push(projectile);
  }

  resetCooldown() {
    this.shootOnCooldown = false;
  }
}

export default Ship;