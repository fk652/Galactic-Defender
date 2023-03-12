import Ship from "./ship";

class EnemyShip extends Ship {
  constructor(game, posX, speed, cooldown) {
    let image = document.createElement("img");
    image.src = "src/assets/enemy1.png";
    let height = 40;
    let width = 40;
    let health = 5;

    if (posX < width) {
      posX = width;
    } else if (posX > game.canvasWidth - width) {
      posX = game.canvasWidth - width;
    }

    const objArgs = {
      width: width,
      height: height,
      position: [posX, 0 - height],
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
      xAdjustment: .45,
      yAdjustment: 0
    }

    super(objArgs, projectileArgs);
  }

  move() {
    const newY = this.position[1] + this.velocity[1];

    // collision against enemy/player logic here?
    // create seperate collision checking function in game class
    if (!this.shootOnCooldown) {
      this.shootProjectile();
      this.shootOnCooldown = true;
      setTimeout(this.resetCooldown.bind(this), this.cooldown);
    }

    if (!this.inYBounds(newY)) {
      const enemies = this.game.allMovingObjects.enemies;
      // enemies.splice(enemies.indexOf(this), 1);
      enemies[enemies.indexOf(this)] = null;
      this.game.enemiesRemaining -= 1;
    } else {
      this.position = [this.position[0], newY]
    }
  }

  inYBounds(y) {
    return y <= this.game.canvasHeight + this.height;
  }
}

export default EnemyShip;