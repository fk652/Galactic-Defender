import Ship from "./ship";
import Projectile from "./projectile";

class EnemyShip extends Ship {
  static WIDTH = 30;
  static HEIGHT = 40;
  static HEALTH = 5;
  static SPEED = 3;

  static PROJECTILE_VELOCITY = [0, 8];
  static PROJECTILE_HEALTH = 1;
  static PROJECTILE_WIDTH = 5;
  static PROJECTILE_HEIGHT = 20;
  static PROJECTILE_COOLDOWN = 150;  // time in ms

  constructor(game) {
    const args = {
      position: [Math.floor(game.canvasWidth / 2), game.canvasHeight - PlayerShip.HEIGHT],
      width: EnemyShip.WIDTH,
      height: EnemyShip.HEIGHT,
      velocity: [0, 0],
      health: PlayerShip.HEALTH,
      game: game,
      imageSrc: "src/assets/player1.png"
    }
    super(args);

    this.shootOnCooldown = false;
  }
}

export default EnemyShip;