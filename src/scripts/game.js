import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Projectile from "./projectile";

class Game {
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.allMovingObjects = {
      player: new PlayerShip(this),
      enemies: [],
      projectiles: [],
      particles: []
    };
  }

  moveObjects() {
    for (let key in this.allMovingObjects) {
      const objectsValue = this.allMovingObjects[key]
      if (objectsValue instanceof Array) {
        objectsValue.forEach(obj => {
          obj.move()
        });
      } else {
        objectsValue.move();
      }
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (let key in this.allMovingObjects) {
      const objectsValue = this.allMovingObjects[key]
      if (objectsValue instanceof Array) {
        objectsValue.forEach(obj => {
          obj.draw(ctx)
        });
      } else {
        objectsValue.draw(ctx);
      }
    }
  }
}

export default Game;