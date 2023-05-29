// Explosion class handles different explosion types for death animations

import MovingObject from "./moving_object";

class Explosion extends MovingObject {
  // position and velocityDeltas are [int, int]
  // explosionType is a string of either "minor" or "major"
  constructor(game, size, position, explosionType, velocityDelta) {
    const image = document.createElement("img");
    
    // minor for enemy ships, major for player/boss death
    if (explosionType === "minor") {
      image.src = "src/assets/images/explosion1.png";
    } else if (explosionType === "major" ) {
      image.src = "src/assets/images/explosion2.png";
    }

    const argsObj = {
      position: position,
      velocity: [0, 0],
      speed: 0,
      health: 0,
      game: game,
      width: size,
      height: size,
      image: image,
      type: "explosions"
    }
    super(argsObj);

    if (explosionType === "minor") {
      this.maxFrames = 20;
      this.imgSize = 192;
      this.cutSize = 5;
    } else if (explosionType === "major" ) {
      this.maxFrames = 48;
      this.imgSize = 240;
      this.cutSize = 8;
    }

    this.frame = 0;
    this.velocityDelta = velocityDelta;
  }

  // explosions are animated sprites with multiple frames
  draw(ctx) {
    const yOffset = Math.floor(this.frame/this.cutSize);
    const xOffset = this.frame % this.cutSize;
    ctx.drawImage(this.image, 
                  this.imgSize*xOffset, this.imgSize*yOffset, this.imgSize, this.imgSize, 
                  this.position[0], this.position[1], this.width, this.height);
    this.frame += 1;

    if (this.frame >= this.maxFrames) {
      this.remove();
    }
  }

  updateVelocity() {
    this.velocity[0] += this.velocityDelta[0];
    this.velocity[1] += this.velocityDelta[1];
  }
}

export default Explosion;