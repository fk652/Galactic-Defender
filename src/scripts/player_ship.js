import Ship from "./ship";
import Explosion from "./explosion";
import { vectorScale } from "./utils";

class PlayerShip extends Ship {
  static SPEED = 5;
  static MAX_HEALTH = 10;

  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/player1.png";
    let height = 48;
    let width = 37;
    const objArgs = {
      width: width,
      height: height,
      position: [Math.floor(game.canvasWidth / 2), game.canvasHeight - height],
      velocity: [0, 0],
      speed: PlayerShip.SPEED,
      health: PlayerShip.MAX_HEALTH,
      game: game,
      image: image,
      type: "player"
    }

    image = document.createElement("img");
    image.src = "src/assets/player_projectile.png";
    const projectileArgs = [{
      objArgs: {
        velocity: [0, -10],
        speed: 10,
        health: 1,
        game: game,
        width: 5,
        height: 20,
        image: image
      },
      type: "bullet",
      origin: "player",
      projectileSound: "playerProjectile"
    }]

    const patternArgs = [{
      positionDeltas: [[width/(2.3), 0]],
      batchFireNum: 1,
      batchFireInterval: 0,
      cooldown: 250,
      onCooldown: false,
      projectileArgIndex: 0
    }]

    super(objArgs, projectileArgs, patternArgs);

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
    let newVelocity = [0, 0];

    if (this.disabled) {
      newVelocity[1] = 2;
    } else {
      if (this.keysPressed.right) newVelocity[0] += PlayerShip.SPEED;
      if (this.keysPressed.left) newVelocity[0] -= PlayerShip.SPEED;
      if (this.keysPressed.up) newVelocity[1] -= PlayerShip.SPEED;
      if (this.keysPressed.down) newVelocity[1] += PlayerShip.SPEED;
    }

    if (newVelocity[0] && newVelocity[1]) newVelocity = vectorScale(newVelocity, this.speed);
    this.velocity = newVelocity;
  }

  shootProjectile() {
    if (this.keysPressed.shoot && !this.disabled) super.shootProjectile();
  }

  handleBounds(newPosition) {
    if (this.inXBounds(newPosition[0])) this.position[0] = newPosition[0];
    if (this.inYBounds(newPosition[1])) this.position[1] = newPosition[1];
  }

  damageTaken(damage) {
    if (!this.invincible) {
      super.damageTaken(damage);
      this.invincible = true;
      this.game.sounds.playPlayerHurtSound();
      setTimeout(this.resetInvincibility.bind(this), 1000);
    }
  }

  remove() {
    if (!this.disabled) { 
      this.disabled = true;

      setTimeout(() => {
        const posX = this.position[0] - 40;
        const posY = this.position[1] - 20;
        new Explosion(this.game, 100, [posX, posY], "major", [0, 0]);
        super.remove();
        this.game.sounds.playPlayerDeathSound();
        setTimeout(this.game.setGameOver.bind(this.game), 3000);
      }, 1000)
    }
  }

  resetInvincibility() {
    this.invincible = false;
  }
}

export default PlayerShip;