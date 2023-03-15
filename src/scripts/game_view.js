import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);
    this.game.bindStartHandler();
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

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
}

export default GameView;