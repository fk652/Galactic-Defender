// MovingObject is the top parent class for ships, projectiles, explosions, etc.

import { rectangleCollision } from "./utils";

class MovingObject {
  // for smoothing gameplay based on fps
  static NORMAL_FRAME_TIME_DELTA = 1000 / 60;

  // takes in an argument object with the following:
  constructor(argsObject) {
    this.position = argsObject["position"];             // initial canvas position [int, int]
    this.velocity = argsObject["velocity"];             // initial velocity [int, int]
    this.speed = argsObject["speed"];                   // initial speed
    this.health = argsObject["health"];                 // initial health
    this.game = argsObject["game"];                     // Game object
    this.width = argsObject["width"];                   // image width
    this.height = argsObject["height"];                 // image height
    this.image = argsObject["image"];                   // image url
    this.type = argsObject["type"];                     // type can be 'enemy', 'boss', 'player', or 'explosion'
    this.rotationAngle = argsObject["rotation"] || 0;   // (optional) image rotation angle in degrees

    // stores itself in the Game with an id
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

  // checks collisions against all hitboxes of the other MovingObject
  collideCheck(otherObj) {
    // hitBoxCollisions is used by subclasses with more complex logic
    const hitBoxCollisions = [];
    
    this.getHitbox().forEach((thisBox, idx) => {
      const collisionFound = otherObj.getHitbox().some(otherBox => { 
        // rectangleCollision is a utility function for mathematically determining collisions
        return rectangleCollision(thisBox, otherBox) 
      })

      if (collisionFound) hitBoxCollisions.push(idx); 
    })

    if (hitBoxCollisions.length > 0) {
      this.handleCollided(otherObj, hitBoxCollisions);
    }
  }

  // will be overwritten by subclasses with more complex logic
  handleCollided(otherObj) {
    const otherObjClass = otherObj.constructor.name;
    
    // three cases: ship to projectile, player to enemy, player to boss
    if (otherObjClass === "Projectile") {
      const damage = otherObj.health;
      otherObj.remove();
      this.damageTaken(damage);
    } else if (otherObjClass === "EnemyShip") {
      const damage = 1;
      this.damageTaken(damage);
    } else if (otherObjClass === "Boss") {
      const damage = 3;
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

  // movement is smoothed out during fps changes
  move(timeDelta) {
    this.updateVelocity();
    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.velocity[0] * velocityScale;
    const offsetY = this.velocity[1] * velocityScale;

    const newX = this.position[0] + offsetX;
    const newY = this.position[1] + offsetY;

    this.handleBounds([newX, newY])
  }

  // updates the position with a new [int, int]
  handleBounds(newPosition) {
    // to be changed in sub classes as needed
    this.position = newPosition;
  }

  updateVelocity() {
    // to be implemented in sub classes as needed
  }

  // these functions take in a y position as int
  inUpperYHeightBounds(y) {
    return (y <= this.game.canvasHeight + this.height);
  }

  inUpperYBounds(y) {
    return (y >= 0);
  }

  inLowerYBounds(y) {
    return (y <= this.game.canvasHeight - this.height);
  }
  
  inYBounds(y) {
    return (this.inUpperYBounds(y) && this.inLowerYBounds(y));
  }

  // these functions take in a x position as int
  inUpperXBounds(x) {
    return (x >= 0);
  }

  inLowerXBounds(x) {
    return (x <= this.game.canvasWidth - this.width);
  }

  inXBounds(x) {
    return (this.inUpperXBounds(x) && this.inLowerXBounds(x));
  }

  // takes in a position as [int, int]
  inBounds(position) {
    return this.inXBounds(position[0]) && this.inYBounds(position[1]);
  }

  remove() {
    delete this.game.allMovingObjects[this.type][this.id];
  }
}

export default MovingObject;