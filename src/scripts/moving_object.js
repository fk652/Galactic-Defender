import { rectangleCollision } from "./utils";

class MovingObject {
  static NORMAL_FRAME_TIME_DELTA = 1000 / 60;

  constructor(argsObject) {
    this.position = argsObject["position"];
    this.velocity = argsObject["velocity"];
    this.health = argsObject["health"];
    this.game = argsObject["game"];
    this.width = argsObject["width"];
    this.height = argsObject["height"];
    this.image = argsObject["image"];
    this.type = argsObject["type"];

    this.id = this.game.idCounter++;
    this.game.allMovingObjects[this.type][this.id] = this;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position[0], this.position[1], this.width, this.height);
  }

  collideCheck(otherObj) {
    const thisHitboxes = this.getHitbox();
    const otherHitboxes = otherObj.getHitbox();

    const found = thisHitboxes.some((thisBox) => {
      return otherHitboxes.some((otherBox) => {
        return rectangleCollision(thisBox, otherBox);
      })
    })

    if (found) {
      this.handleCollided(otherObj);
    }
  }

  handleCollided(otherObj) {
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
    // to be implemented in sub classes
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