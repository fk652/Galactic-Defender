import Ship from "./ship";
import MovingObject from "./moving_object";
import Explosion from "./explosion";

class EnemyShip extends Ship {
  constructor(game, posX, speed, cooldown) {
    let image = document.createElement("img");
    image.src = "src/assets/enemy1.png";
    let height = 40;
    let width = 46;

    // scale based on wave here or do it within game.setEnemy
    let health = 1 + Math.floor(game.enemyWave / 2.5); // update this

    if (posX < 0 - width) {
      posX = 0;
    } else if (posX > game.canvasWidth - width) {
      posX = game.canvasWidth - width;
    }

    const objArgs = {
      width: width,
      height: height,
      position: [posX, 0 - (height * 2)],
      velocity: [0, speed],
      health: health,
      game: game,
      image: image
    }

    image = document.createElement("img");
    image.src = "src/assets/enemy_projectile.png";

    const projectileArgs = {
      objArgs: {
        velocity: [0, 8],
        health: 1,
        game: game,
        width: 5,
        height: 20,
        image: image
      },
      origin: "enemy",
      cooldown: cooldown,
      xAdjustment: .25,
      yAdjustment: 10
    }

    super(objArgs, projectileArgs);
    this.projectileSound = "enemyProjectile";
  }

  move(timeDelta) {
    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.velocity[0] * velocityScale;
    const offsetY = this.velocity[1] * velocityScale;

    const newX = this.position[0] + offsetX;
    const newY = this.position[1] + offsetY;

    // collision against enemy/player logic here?
    // create seperate collision checking function in game class
    if (!this.shootOnCooldown) {  // do this within shoot function
      this.shootProjectile();
      this.shootOnCooldown = true;  // do this within shoot function
      setTimeout(this.resetCooldown.bind(this), this.cooldown); //do this within shoot function
    }

    if (!this.inYBounds(newY)) {
      this.remove();
    } else {
      this.position = [newX, newY]
    }
  }

  inYBounds(y) {
    return y <= this.game.canvasHeight + this.height;
  }

  remove() {
    const enemies = this.game.allMovingObjects.enemies;
    enemies[enemies.indexOf(this)] = null;
    this.game.enemiesRemaining -= 1;
  }

  damageTaken(damage) {
    super.damageTaken(damage);

    if (this.health <= 0) {
      try {
        this.game.sounds.add("explosion");
        const explosion = new Explosion(this.game, 80, this.position);
        this.game.allMovingObjects.explosions.push(explosion);
      } catch(error) {
        // console.error();
        // console.log(this.game);
      }

      this.remove();
      this.game.score += 10;
    }
  }
}

export default EnemyShip;