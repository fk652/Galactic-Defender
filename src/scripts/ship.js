// Ship is the top parent class for player, enemy, and boss ships

import MovingObject from "./moving_object";
import Projectile from "./projectile";
import Timer from "./timer";

class Ship extends MovingObject {
  // takes in constructor argument objects for MovingObject and Projectile
  // and takes in an array of shooting pattern objects
  constructor(objArgs, projectileArgs, patternArgs) {
    super(objArgs);
    this.projectileArgs = projectileArgs;
    this.patternArgs = patternArgs;
  }

  // ships can have multiple projectile patterns and possible batch firing
  // each pattern has it's own cooldown
  shootProjectile() {
    this.patternArgs.forEach((pattern, idx) => {
      // fire pattern if off cooldown and ship in game bounds
      if (!pattern.onCooldown && this.inBounds(this.position)) {
        // batch firing
        for (let i = 0; i < pattern.batchFireNum; i ++) {
          new Timer(this.game, () => {
            // only fire if ship still alive when timer callback activates
            if (this.health > 0) {
              // create new Projectile at each position in the pattern
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

        // play projectile sound
        const projSound = this.projectileArgs[pattern.projectileArgIndex].projectileSound;
        this.playShootSound(projSound);
        
        // set cooldown and start timer to reset it
        pattern.onCooldown = true;
        const batchCooldownOffset = pattern.batchFireInterval * pattern.batchFireNum;
        pattern.timer = new Timer(this.game, this.resetCooldown.bind(this, idx), (pattern.cooldown + batchCooldownOffset));
      }
    })
  }

  // projectileSound is a string of either 'playerProjectile', 'bossProjectile', or 'enemyProjectile'
  playShootSound(projectileSound) {
    this.game.sounds.add(projectileSound);
  }

  // takes in an index for the shooting patterns array
  resetCooldown(index) {
    this.patternArgs[index].onCooldown = false;
    this.patternArgs[index].timer = null;
  }

  damageTaken(damage) {
    this.health -= damage;
    if (this.health <= 0) this.remove();
  }
}

export default Ship;