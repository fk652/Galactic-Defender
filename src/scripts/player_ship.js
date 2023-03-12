import Ship from "./ship";

class PlayerShip extends Ship {
  static SPEED = 5;
  static UP_KEYS = ["ArrowUp", 'w']
  static DOWN_KEYS = ["ArrowDown", 's']
  static RIGHT_KEYS = ["ArrowRight", 'd']
  static LEFT_KEYS = ["ArrowLeft", 'a']

  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/player1.png";
    let height = 40;
    let width = 20;
    let health = 10;

    const objArgs = {
      width: width,
      height: height,
      position: [Math.floor(game.canvasWidth / 2), game.canvasHeight - height],
      velocity: [0, 0],
      health: health,
      game: game,
      image: image
    }

    image = document.createElement("img");
    image.src = "src/assets/player_projectile.png";

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
      xAdjustment: .75,
      yAdjustment: 0
    }

    super(objArgs, projectileArgs);

    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
    }

    this.disabled = false;
    this.invincible = false;
  }

  updateVelocity() {
    const newVelocity = [0, 0];

    // console.log(this.disabled);
    if (this.disabled) {
      newVelocity[1] = 2;
    } else {
      if (this.keysPressed.right) newVelocity[0] += PlayerShip.SPEED;
      if (this.keysPressed.left) newVelocity[0] -= PlayerShip.SPEED;
      if (this.keysPressed.up) newVelocity[1] -= PlayerShip.SPEED;
      if (this.keysPressed.down) newVelocity[1] += PlayerShip.SPEED;
    }

    this.velocity = newVelocity;
  }

  // move() {
  //   // check for collision logic here?
  //   // create seperate collision checking function in game class
  //   // console.log(this.disabled);
  //   this.updateVelocity();

  //   if (this.keysPressed.shoot && !this.shootOnCooldown && !this.disabled) {
  //     this.shootProjectile();
  //   }
  //   super.move();
  // }

  move(timeDelta) {
    // check for collision logic here?
    // create seperate collision checking function in game class
    // console.log(this.disabled);
    this.updateVelocity();

    if (this.keysPressed.shoot && !this.shootOnCooldown && !this.disabled) {
      this.shootProjectile();
    }
    super.move(timeDelta);
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

  damageTaken(damage) {
    if (!this.invincible) {
      super.damageTaken(damage);
      this.invincible = true;
      setTimeout(this.resetInvincibility.bind(this), 1000);
    }

    if (this.health <= 0) {
      // activate game over here
      this.remove();
    }
  }

  resetInvincibility() {
    this.invincible = false;
  }

  remove() {
    // this.game.player = null;
    this.game.allMovingObjects.player = null;
  }
}

export default PlayerShip;