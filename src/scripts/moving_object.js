class MovingObject {
  constructor(argsObject) {
    this.position = argsObject["position"];
    this.velocity = argsObject["velocity"];
    this.health = argsObject["health"];
    this.game = argsObject["game"];
    this.width = argsObject["width"];
    this.height = argsObject["height"];
    this.image = argsObject["image"];

    // this.position[0] = Math.round(this.position[0]);
    // this.position[1] = Math.round(this.position[1]);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position[0], this.position[1], this.width, this.height);
  }

  move() {
    const newX = this.position[0] + this.velocity[0];
    const newY = this.position[1] + this.velocity[1];

    if (this.inXBounds(newX)) this.position[0] = newX;
    if (this.inYBounds(newY)) this.position[1] = newY;
  }

  inXBounds(x) {
    return (x > 0 && x < this.game.canvasWidth - this.width);
  }

  inYBounds(y) {
    return (y > 0 && y < this.game.canvasHeight - this.height);
  }

  inBounds(position) {
    return this.inXBounds(position[0]) && this.inYBounds(position[1]);
  }
}

export default MovingObject;