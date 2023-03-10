import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);

    // to be changed with setting up start menu listener first, 
    // then removing that and adding movement listener
    this.bindMovementHandlers();
  }

  start() {
    setInterval(() => {
      this.game.moveObjects();
      this.game.draw(this.ctx);
    }, 20)
  }

  bindMovementHandlers() {
    this.game.allMovingObjects.player.bindMovementHandlers();
  }
}

export default GameView;