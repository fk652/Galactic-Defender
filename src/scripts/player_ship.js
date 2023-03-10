import Ship from "./ship";
import Explosion2 from "./explosion2";

class PlayerShip extends Ship {
  static SPEED = 5;
  static UP_KEYS = ["ArrowUp", 'w']
  static DOWN_KEYS = ["ArrowDown", 's']
  static RIGHT_KEYS = ["ArrowRight", 'd']
  static LEFT_KEYS = ["ArrowLeft", 'a']
  static MAX_HEALTH = 10;

  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/player1.png";
    let height = 48;
    let width = 37;
    let health = 10;
    // let health = -2;

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
      xAdjustment: .3,
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

  getHitbox() {
    const box1 = {
      x: this.position[0] + (this.width / 3),
      y: this.position[1],
      width: this.width / 3,
      height: this.height
    }

    const box2 = {
      x: this.position[0],
      y: this.position[1] + (this.height * .65),
      width: this.width,
      height: this.height/5
    }

    return [box1, box2];
  }

  updateVelocity() {
    const newVelocity = [0, 0];

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

  move(timeDelta) {
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
    if (event.key === " ") event.preventDefault();

    if (PlayerShip.RIGHT_KEYS.includes(event.key)) this.keysPressed.right = false;
    else if (PlayerShip.LEFT_KEYS.includes(event.key)) this.keysPressed.left = false;
    else if (PlayerShip.UP_KEYS.includes(event.key)) this.keysPressed.up = false;
    else if (PlayerShip.DOWN_KEYS.includes(event.key)) this.keysPressed.down = false;
    else if (event.key === " ") this.keysPressed.shoot = false;
  }

  handleMouseDown(event) {
    this.keysPressed.shoot = true;
  }

  handleMouseUp(event) {
    this.keysPressed.shoot = false;
  }

  bindControlHandlers() {
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
    document.addEventListener("mousedown", this.mouseDownHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
  }

  removeControlHandlers() {
    document.removeEventListener("keydown", this.keyDownHandler);
    document.removeEventListener("keyup", this.keyUpHandler);
    document.removeEventListener("mousedown", this.mouseDownHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
  }

  damageTaken(damage) {
    if (!this.invincible) {
      super.damageTaken(damage);
      this.invincible = true;
      setTimeout(this.resetInvincibility.bind(this), 1000);
    }

    if (this.health <= 0 && !this.disabled) {
      // add explosion with 0 velocity here
      this.disabled = true;

      setTimeout(() => {
        this.remove()
        try {
          const posX = this.position[0] - 40;
          const posY = this.position[1] - 20;
          const finalExplosion = new Explosion2(this.game, 100, [posX, posY]);
          finalExplosion.dy = 0;
          this.game.allMovingObjects.explosions.push(finalExplosion);
        } catch(error) {
          // console.error();
          // console.log(this.game);
        }
        setTimeout(this.game.setGameOver.bind(this.game), 2000);
      }, 1000)

      // put remove and setGameOver on setTimeout
      // this.remove();
      // this.game.setGameOver();
    }
  }

  resetInvincibility() {
    this.invincible = false;
  }

  remove() {
    this.game.allMovingObjects.player = null;
  }
}

export default PlayerShip;