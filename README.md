# Galactic Defender

## [Click here to play](https://fk652.github.io/Galactic-Defender/)

___

## Background

___

Galactic Defender is a galaxy shooter game, based off the classic [Space Invaders](https://en.wikipedia.org/wiki/Space_Invaders) and [Galaga](https://en.wikipedia.org/wiki/Galaga) games. The main gameplay involves the player controlling a ship that moves around in a fixed 2d screen and shoots down enemy ships/aliens, while also avoiding enemies and their projectiles.

In Galactic Defender the player's goal is to survive waves of enemies.

![enemy wave screenshot](./src/assets/screenshots/enemy_wave.png)

...and defeat the boss at the end.

![boss fight screenshot](./src/assets/screenshots/boss_fight.png)

It's game over if the player loses all their health points (HP) before defeating the boss. Enemies also have their own HP that must be depleted to be destroyed, with scaling difficulty.

## Instructions

___

Controls are simply arrow keys (or WASD) to move in any direction, spacebar or left click to shoot (can be held down to continously shoot), and a clickable toggle mute button.

![instructions screenshot](./src/assets/screenshots/game_instructions.png)

## Functionality & MVPs

___

* [x] The player can move anywhere across the game screen using WASD or arrow keys and can shoot projectiles with spacebar or left click.
* [x] All enemies spawn in from the top of the game screen, move from top to bottom, and shoot projectiles.
* [x] Waves of around 5-20 enemies, and all must either be destroyed or have moved off the screen to get to the next wave.
* [x] Boss spawns in after 5 waves, and will be a giant ship moving along the top of the screen with multiple phases of shooting patterns, and has alot more HP compared to normal enemies.
* [x] Start game screen, game over screen, and win screen.
* [x] Player can retry on win or lose.

## How the game is rendered

___

The GameView class animates the current state of the game on canvas using requestAnimationFrame

```javascript
animate(time) {
  if (this.game.startScreen || this.game.gameOver || this.game.win) {
    this.game.drawStartWinGameOver(this.ctx);
  } else {
    const timeDelta = time - this.lastTime;
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
  }

  this.lastTime = time;
  requestAnimationFrame(this.animate.bind(this));
}
```

In Game class, the step function applies game logic to determine the next state of the game, such as where objects are positioned next, what objects are to be added or removed, and collision detection.

```javascript
step(timeDelta) {
  this.clearNulls();
  this.checkCollisions();
  this.updateInformation();
  this.setEnemies();
  this.moveObjects(timeDelta);
}
```

The draw function then draws all objects contained in the allMovingObjects attribute.

```javascript
draw(ctx) {
  ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

  this.drawBackground(ctx);

  for (let key in this.allMovingObjects) {
    const objectsValue = this.allMovingObjects[key]
    if (objectsValue instanceof Array) {
      objectsValue.forEach(obj => {
        if (obj) obj.draw(ctx);
      });
    } else {
      if (objectsValue) objectsValue.draw(ctx);
    }
  }
}
```

## Wireframe

___

![wireframe diagram](./src/assets/screenshots/Wireframe.png)

* Nav links include a link to this project's Github repo and my LinkedIn.
* Game instructions include basic controls and any rules about the game.
* Game information will dynamically be updated with the current state of the game.
* Game screen will be a Canvas element that renders the actual gameplay.

## Technologies, Libraries, APIs

___

* This project will be written with HTML, CSS, and JavaScript.
* Canvas API to render the game.
* npm to manage project dependencies.
* Webpack and Babel to bundle and transpile the source JavaScript code.

## Implementation Timeline

___

* Thursday (March 11):
  * Planning and research. Setup project, work on setting up the HTML page and Canvas game screen.
* Friday Afternoon & Weekend (March 10-12):
  * Finishing up the webpage. Completing minimum gameplay functionalities.
* Monday (March 13):
  * Complete starting and end game screen, views, logic, and transitions.
* Tuesday (March 14):
  * Polishing up the minimal product, and start working on extra features.
* Wednesday (March 15):
  * Continue working on extra features.
* Thursday Morning (March 16):
  * Polish and deploy product.
* Afterwards:
  * Continue Working on bonus features and extra implementations.

## Bonus features

___

* [x] Music and sound effects, with the option to mute.
* [x] Scrolling background that moves along with the game.
* [ ] Player can collect upgrades, dropped randomly from destroyed enemies, that will improve their shooting pattern and damage.
* [ ] Enemy variety with different movement and shooting patterns.
* [ ] Indestructable obstacles like asteroids that the player must avoid.
* [ ] Multiple levels with different backgrounds and final bosses. Player must then beat all levels to win the game.
* [ ] Player can also control the ship with mouse movements.

## Credits

___

* All assets were provided as free open source material from [itch.io](https://itch.io/)
  * Game backgrounds were generated [here](https://deep-fold.itch.io/space-background-generator)
  * All other assets including images, sound effects, and background music were made by [GameSupplyGuy](https://gamesupply.itch.io/ultimate-space-game-mega-asset-package)