import Ship from "./ship";
import MovingObject from "./moving_object";
import Explosion from "./explosion";

class EnemyShip extends Ship {
  constructor(game, posX, speed, cooldown) {
    let image = document.createElement("img");
    image.src = "src/assets/enemy1.png";
    let height = 40;
    let width = 46;
    // let health = 1 + Math.floor(game.enemyWave / 2.5);
    let health = 1;

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
      speed: speed,
      health: health,
      game: game,
      image: image,
      type: "enemies"
    }

    image = document.createElement("img");
    image.src = "src/assets/enemy_projectile.png";

    const projectileArgs = {
      objArgs: {
        velocity: [0, 8],
        speed: 8,
        health: 1,
        game: game,
        width: 5,
        height: 20,
        image: image
      },
      origin: "enemy",
      cooldown: cooldown,
      adjustments: [.25, 10],
      projectileSound: "enemyProjectile"
    }

    super(objArgs, projectileArgs);
  }

  handleBounds(newPosition) {
    if (!this.inUpperYHeightBounds(newPosition[1])) {
      this.remove();
    } else {
      this.position = newPosition;
    }
  }

  remove() {
    if (this.health <= 0) {
      try {
        this.game.sounds.add("explosion");
        const explosion = new Explosion(this.game, 80, this.position, "minor", [0, 0.5]);
      } catch(error) {
        // console.error();
        // console.log(this.game);
      }

      this.game.score += 10;
    }

    super.remove();
    this.game.enemiesRemaining -= 1;
  }
}

export default EnemyShip;