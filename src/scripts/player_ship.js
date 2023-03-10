import MovingObject from "./moving_object";

class PlayerShip extends MovingObject {
  static WIDTH = 20;
  static HEIGHT = 40;
  static HEALTH = 10;
  static SPEED = 5;

  static UPKEYS = ["ArrowUp", 'w']
  static DOWNKEYS = ["ArrowDown", 's']
  static RIGHTKEYS = ["ArrowRight", 'd']
  static LEFTKEYS = ["ArrowLeft", 'a']

  constructor(game) {
    const args = {
      position: [Math.floor(game.canvasWidth / 2), game.canvasHeight - PlayerShip.HEIGHT],
      width: PlayerShip.WIDTH,
      height: PlayerShip.HEIGHT,
      velocity: [0, 0],
      health: PlayerShip.HEALTH,
      game: game,
      imageSrc: "src/assets/spaceship2_alt.png"
    }
    super(args);

    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false
    }
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
    super.move();
  }

  handleKeyDown(event) {
    event.preventDefault();

    if (PlayerShip.RIGHTKEYS.includes(event.key)) this.keysPressed.right = true;
    if (PlayerShip.LEFTKEYS.includes(event.key)) this.keysPressed.left = true;
    if (PlayerShip.UPKEYS.includes(event.key)) this.keysPressed.up = true;
    if (PlayerShip.DOWNKEYS.includes(event.key)) this.keysPressed.down = true;
  }
  
  handleKeyUp(event) {
    event.preventDefault();

    if (PlayerShip.RIGHTKEYS.includes(event.key)) this.keysPressed.right = false;
    if (PlayerShip.LEFTKEYS.includes(event.key)) this.keysPressed.left = false;
    if (PlayerShip.UPKEYS.includes(event.key)) this.keysPressed.up = false;
    if (PlayerShip.DOWNKEYS.includes(event.key)) this.keysPressed.down = false;
  }

  bindMovementHandlers() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
    document.addEventListener("keyup", this.handleKeyUp.bind(this))
  }
}

export default PlayerShip;