import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);
    this.game.bindStartHandler();
    this.start();
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    // draw moving background here?

    // handle start, game over, and win screen draw here?
    // can DRY draw messages here later
    if (this.game.startMenu) {
      if (!this.game.drawn) this.game.drawStartMenu(this.ctx);
    } else if (this.game.gameOver) {
      if (!this.game.drawn) this.game.drawGameOver(this.ctx);
    } else if (this.game.win) {
      if (!this.game.drawn) this.game.drawWin(this.ctx);
    } else {
      const timeDelta = time - this.lastTime;
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
    }

    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
}

export default GameView;