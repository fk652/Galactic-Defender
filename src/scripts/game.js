import PlayerShip from "./player_ship";
import EnemyShip from "./enemy_ship";
import Projectile from "./projectile";

class Game {
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.enemyWave = 0;
    this.gameOver = false;

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

  updateInformation() {
    const player = this.allMovingObjects.player;
    const playerHealthBar = document.getElementById("player-health-bar");

    const playerHealthPoint = document.createElement("li");
    playerHealthPoint.setAttribute("class", "player-health-point");

    if (playerHealthBar.children.length < player.health) {
      for (let i = 0; i < player.health - playerHealthBar.children.length; i++) {
        playerHealthBar.appendChild(playerHealthPoint);
      }
    } else if ((playerHealthBar.children.length > player.health)) {
      for (let i = 0; i < playerHealthBar.children.length - player.health; i++) {
        playerHealthBar.removeChild();
      }
    }

    const waveSpan = document.getElementById("wave-number");
    waveSpan.innerText = this.enemyWave;

    const enemiesRemainingSpan = document.getElementById("enemies-remaining");
    enemiesRemainingSpan.innerText = this.allMovingObjects.enemies.length;
  }

  setEnemies() {
    // check if enemy array is empty
    // if empty, increment wave number
    // add enemies to enemy array accordingly to wave number
  }
}

export default Game;