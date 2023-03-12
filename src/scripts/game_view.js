import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);

    // to be changed with setting up start menu listener first, 
    // then removing that and adding movement listener
    this.bindControlHandlers();
  }

  start() {
    setInterval(() => {
      this.game.clearNulls();
      this.game.updateInformation();
      this.game.setEnemies();
      this.game.moveObjects();
      this.game.draw(this.ctx);
    }, 20)
  }

  bindControlHandlers() {
    this.game.allMovingObjects.player.bindControlHandlers();
  }
}

export default GameView;