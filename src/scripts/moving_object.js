import { rectangleCollision } from "./utils";

class MovingObject {
  static NORMAL_FRAME_TIME_DELTA = 1000 / 60;

  constructor(argsObject) {
    this.position = argsObject["position"];
    this.velocity = argsObject["velocity"];
    this.speed = argsObject["speed"];
    this.health = argsObject["health"];
    this.game = argsObject["game"];
    this.width = argsObject["width"];
    this.height = argsObject["height"];
    this.image = argsObject["image"];
    this.type = argsObject["type"];
    this.rotationAngle = argsObject["rotation"] || 0;

    this.id = this.game.idCounter++;
    this.game.allMovingObjects[this.type][this.id] = this;
  }

  draw(ctx) {
    // ctx.drawImage(this.image, this.position[0], this.position[1], this.width, this.height);

    // rotate from center
    const [x, y] = this.position;
    const [centerX, centerY] = [x + (this.width/2), y + (this.height/2)]
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((Math.PI / 180) * this.rotationAngle);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(this.image, x, y, this.width, this.height);
    ctx.restore();
  }

  collideCheck(otherObj) {
    const hitBoxCollisions = [];
    this.getHitbox().forEach((thisBox, idx) => {
      const collisionFound = otherObj.getHitbox().some(otherBox => { 
        return rectangleCollision(thisBox, otherBox) 
      })
      if (collisionFound) hitBoxCollisions.push(idx); 
    })

    if (hitBoxCollisions.length > 0) {
      // hitBoxCollisions will be used by subclasses with more complex logic
      this.handleCollided(otherObj, hitBoxCollisions);
    }
  }

  handleCollided(otherObj) {
    // will be overwritten by subclasses with more complex logic
    // two case: enemy/player to projectile, player to enemy
    const otherObjClass = otherObj.constructor.name;

    if (otherObjClass === "Projectile") {
      const damage = otherObj.health;
      otherObj.remove();
      this.damageTaken(damage);
    } else if (otherObjClass === "EnemyShip") {
      const damage = 1;
      this.damageTaken(damage);
    } else if (otherObjClass === "Boss") {
      const damage = 2;
      this.damageTaken(damage);
    }
  }

  getHitbox() {
    const [x, y] = this.position;
    const width = this.width;
    const height = this.height;
    return [{
      x: x,
      y: y,
      width: width,
      height: height
    }]
  }

  move(timeDelta) {
    this.updateVelocity();
    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.velocity[0] * velocityScale;
    const offsetY = this.velocity[1] * velocityScale;

    const newX = this.position[0] + offsetX;
    const newY = this.position[1] + offsetY;

    this.handleBounds([newX, newY])
  }

  handleBounds(newPosition) {
    // to be changed in most sub classes
    this.position = newPosition;
  }

  updateVelocity() {
    // to be implemented in sub classes
  }

  inUpperYHeightBounds(y) {
    return (y <= this.game.canvasHeight + this.height);
  }

  inUpperXBounds(x) {
    return (x >= 0);
  }

  inUpperYBounds(y) {
    return (y >= 0);
  }

  inLowerXBounds(x) {
    return (x <= this.game.canvasWidth - this.width);
  }

  inLowerYBounds(y) {
    return (y <= this.game.canvasHeight - this.height);
  }

  inXBounds(x) {
    return (this.inUpperXBounds(x) && this.inLowerXBounds(x));
  }

  inYBounds(y) {
    return (this.inUpperYBounds(y) && this.inLowerYBounds(y));
  }

  inBounds(position) {
    return this.inXBounds(position[0]) && this.inYBounds(position[1]);
  }

  remove() {
    delete this.game.allMovingObjects[this.type][this.id];
  }
}

export default MovingObject;