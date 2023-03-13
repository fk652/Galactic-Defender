import MovingObject from "./moving_object";

class Explosion extends MovingObject {
  constructor(game, velocity, size, position) {
    const image = document.createElement("img");
    image.src = "src/assets/explosion1.png";

    const argsObj = {
      position: position,
      velocity: velocity,
      health: 0,  // health won't matter for explosion
      game: game,
      width: size,
      height: size,
      image: image
    }
    super(argsObj);

    this.frame = 0;
  }

  draw(ctx) {
    const yOffset = Math.floor(this.frame/5);
    const xOffset = this.frame % 5;
    // console.log(xOffset, yOffset);
    ctx.drawImage(this.image, 
                  192*xOffset, 192*yOffset, 192, 192, 
                  this.position[0], this.position[1], this.width, this.height);
    this.frame += 1;
    this.velocity[1] += 1;

    // remove once this.frame >= 20
    if (this.frame >= 20) {
      this.remove();
    }
  }

  // remove once animation frame limit reached
  remove() {
    const explosions = this.game.allMovingObjects.explosions;
    explosions[explosions.indexOf(this)] = null;
  }
}

export default Explosion;