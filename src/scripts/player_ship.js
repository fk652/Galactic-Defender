import MovingObject from "./moving_object";
import Projectile from "./projectile";

class PlayerShip extends MovingObject {
  static WIDTH = 20;
  static HEIGHT = 40;
  static HEALTH = 10;
  static SPEED = 5;
  static COOLDOWN = 250;  // time in ms

  static PROJECTILE_VELOCITY = [0, -10];
  static PROJECTILE_HEALTH = 1;
  static PROJECTILE_WIDTH = 5;
  static PROJECTILE_HEIGHT = 20;

  static UP_KEYS = ["ArrowUp", 'w']
  static DOWN_KEYS = ["ArrowDown", 's']
  static RIGHT_KEYS = ["ArrowRight", 'd']
  static LEFT_KEYS = ["ArrowLeft", 'a']

  constructor(game) {
    const args = {
      position: [Math.floor(game.canvasWidth / 2), game.canvasHeight - PlayerShip.HEIGHT],
      width: PlayerShip.WIDTH,
      height: PlayerShip.HEIGHT,
      velocity: [0, 0],
      health: PlayerShip.HEALTH,
      game: game,
      imageSrc: "src/assets/player1.png"
    }
    super(args);

    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
    }

    this.shootOnCooldown = false;
  }

  updateVelocity() {
    const newVelocity = [0, 0];
    if (this.keysPressed.right) newVelocity[0] += PlayerShip.SPEED;
    if (this.keysPressed.left) newVelocity[0] -= PlayerShip.SPEED;
    if (this.keysPressed.up) newVelocity[1] -= PlayerShip.SPEED;
    if (this.keysPressed.down) newVelocity[1] += PlayerShip.SPEED;
    this.velocity = newVelocity;
  }

  move() {
    this.updateVelocity();
    if (this.keysPressed.shoot && !this.shootOnCooldown) {
      this.shootProjectile();
      this.shootOnCooldown = true;
      setTimeout(this.resetCooldown.bind(this), PlayerShip.COOLDOWN);
    }
    super.move();
  }

  handleKeyDown(event) {
    event.preventDefault();

    if (PlayerShip.RIGHT_KEYS.includes(event.key)) this.keysPressed.right = true;
    if (PlayerShip.LEFT_KEYS.includes(event.key)) this.keysPressed.left = true;
    if (PlayerShip.UP_KEYS.includes(event.key)) this.keysPressed.up = true;
    if (PlayerShip.DOWN_KEYS.includes(event.key)) this.keysPressed.down = true;
    if (event.key === " ") this.keysPressed.shoot = true;
  }
  
  handleKeyUp(event) {
    event.preventDefault();

    if (PlayerShip.RIGHT_KEYS.includes(event.key)) this.keysPressed.right = false;
    if (PlayerShip.LEFT_KEYS.includes(event.key)) this.keysPressed.left = false;
    if (PlayerShip.UP_KEYS.includes(event.key)) this.keysPressed.up = false;
    if (PlayerShip.DOWN_KEYS.includes(event.key)) this.keysPressed.down = false;
    if (event.key === " ") this.keysPressed.shoot = false;
  }

  bindControlHandlers() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("mousedown", e => this.keysPressed.shoot = true);
    document.addEventListener("mouseup", e => this.keysPressed.shoot = false);
  }

  shootProjectile() {
    const projectile = new Projectile({
      position: [this.position[0] + this.width/2.75, this.position[1]],
      velocity: PlayerShip.PROJECTILE_VELOCITY,
      health: PlayerShip.PROJECTILE_HEALTH,
      game: this.game,
      width: PlayerShip.PROJECTILE_WIDTH,
      height: PlayerShip.PROJECTILE_HEIGHT,
      imageSrc: "src/assets/player_projectile.png"
    }, "player");
    this.game.allMovingObjects.projectiles.push(projectile);
  }

  resetCooldown() {
    this.shootOnCooldown = false;
  }

  // to be implemented later for game over and reset purposes
  removeControlHandlers() {

  }
}

export default PlayerShip;