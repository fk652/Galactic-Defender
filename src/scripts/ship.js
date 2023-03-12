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
    this.shootOnCooldown = true;
    setTimeout(this.resetCooldown.bind(this), this.cooldown);
  }

  resetCooldown() {
    this.shootOnCooldown = false;
  }

  damageTaken(damage) {
    this.health -= damage;
    // remove if enemy health <= 0
    // game over if player health <= 0
    // console.log(this.health);
  }
}

export default Ship;