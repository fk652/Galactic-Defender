import Ship from "./ship";
import Projectile from "./projectile";

class PlayerShip extends Ship {
  static WIDTH = 20;
  static HEIGHT = 40;
  static HEALTH = 10;
  static SPEED = 5;

  // static PROJECTILE_VELOCITY = [0, -10];
  // static PROJECTILE_HEALTH = 1;
  // static PROJECTILE_WIDTH = 5;
  // static PROJECTILE_HEIGHT = 20;
  // static PROJECTILE_COOLDOWN = 250;  // time in ms

  static UP_KEYS = ["ArrowUp", 'w']
  static DOWN_KEYS = ["ArrowDown", 's']
  static RIGHT_KEYS = ["ArrowRight", 'd']
  static LEFT_KEYS = ["ArrowLeft", 'a']

  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/player1.png";
    let scale = 0.05;
    let height = 40;
    let width = 20;

    const objArgs = {
      width: width,
      height: height,
      position: [Math.floor(game.canvasWidth / 2), game.canvasHeight - height],
      velocity: [0, 0],
      health: PlayerShip.HEALTH,
      game: game,
      image: image
    }

    image = document.createElement("img");
    image.src = "src/assets/player_projectile.png";
    scale = 0.05;
    height = Math.round(image.height * scale);
    width = Math.round(image.width * scale)

    const projectileArgs = {
      objArgs: {
        velocity: [0, -10],
        health: 1,
        game: game,
        width: 5,
        height: 20,
        image: image
      },
      origin: "player",
      cooldown: 250,
      xAdjustment: .75
    }

    super(objArgs, projectileArgs);

    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
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
    // check for collision logic here?
    // create seperate collision checking function in game class
    this.updateVelocity();

    if (this.keysPressed.shoot && !this.shootOnCooldown) {
      this.shootProjectile();
      this.shootOnCooldown = true;
      setTimeout(this.resetCooldown.bind(this), this.cooldown);
    }
    super.move();
  }

  handleKeyDown(event) {
    event.preventDefault();

    if (PlayerShip.RIGHT_KEYS.includes(event.key)) this.keysPressed.right = true;
    else if (PlayerShip.LEFT_KEYS.includes(event.key)) this.keysPressed.left = true;
    else if (PlayerShip.UP_KEYS.includes(event.key)) this.keysPressed.up = true;
    else if (PlayerShip.DOWN_KEYS.includes(event.key)) this.keysPressed.down = true;
    else if (event.key === " ") this.keysPressed.shoot = true;
  }
  
  handleKeyUp(event) {
    event.preventDefault();

    if (PlayerShip.RIGHT_KEYS.includes(event.key)) this.keysPressed.right = false;
    else if (PlayerShip.LEFT_KEYS.includes(event.key)) this.keysPressed.left = false;
    else if (PlayerShip.UP_KEYS.includes(event.key)) this.keysPressed.up = false;
    else if (PlayerShip.DOWN_KEYS.includes(event.key)) this.keysPressed.down = false;
    else if (event.key === " ") this.keysPressed.shoot = false;
  }

  bindControlHandlers() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("mousedown", e => this.keysPressed.shoot = true);
    document.addEventListener("mouseup", e => this.keysPressed.shoot = false);
  }

  // to be implemented later for game over and reset purposes
  removeControlHandlers() {

  }
}

export default PlayerShip;