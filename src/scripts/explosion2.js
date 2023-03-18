import MovingObject from "./moving_object";

class Explosion2 extends MovingObject {
  constructor(game, size, position) {
    const image = document.createElement("img");
    image.src = "src/assets/explosion2.png";

    const argsObj = {
      position: position,
      velocity: [0, 0],
      health: 0,
      game: game,
      width: size,
      height: size,
      image: image,
      type: "explosions"
    }
    super(argsObj);

    this.frame = 0;
    this.dx = 0;
    this.dy = 1;
  }

  draw(ctx) {
    const yOffset = Math.floor(this.frame/8);
    const xOffset = this.frame % 8;
    ctx.drawImage(this.image, 
                  240*xOffset, 240*yOffset, 240, 240, 
                  this.position[0], this.position[1], this.width, this.height);
    this.frame += 1;
    this.velocity[0] += this.dx;
    this.velocity[1] += this.dy;

    if (this.frame >= 48) {
      this.remove();
    }
  }
}

export default Explosion2;