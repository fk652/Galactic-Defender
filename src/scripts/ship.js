import MovingObject from "./moving_object";
import Projectile from "./projectile";
import Timer from "./timer";

class Ship extends MovingObject {
  constructor(objArgs, projectileArgs, patternArgs) {
    super(objArgs);
    this.projectileArgs = projectileArgs;
    this.patternArgs = patternArgs;
  }

  shootProjectile() {
    this.patternArgs.forEach((pattern, idx) => {
      if (!pattern.onCooldown && this.inBounds(this.position)) {
        for (let i = 0; i < pattern.batchFireNum; i ++) {
          new Timer(this.game, () => {
            if (this.health > 0) {
              pattern.positionDeltas.forEach(delta => {
                const [x, y] = this.position;
                const [dx, dy] = delta;
                const startPosition = [x + dx, y + dy];

                const projArgs = this.projectileArgs[pattern.projectileArgIndex];
                projArgs.objArgs.position = startPosition;

                new Projectile(projArgs);
              })
            }
          }, pattern.batchFireInterval * i);
        }
        
        const projSound = this.projectileArgs[pattern.projectileArgIndex].projectileSound;
        this.playShootSound(projSound);
        
        pattern.onCooldown = true;
        const batchCooldownOffset = pattern.batchFireInterval * pattern.batchFireNum;
        new Timer(this.game, this.resetCooldown.bind(this, idx), (pattern.cooldown + batchCooldownOffset));
      }
    })
  }

  playShootSound(projectileSound) {
    this.game.sounds.add(projectileSound);
  }

  resetCooldown(index) {
    this.patternArgs[index].onCooldown = false;
  }

  damageTaken(damage) {
    this.health -= damage;
    if (this.health <= 0) this.remove();
  }
}

export default Ship;