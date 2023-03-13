import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);

    // to be changed with setting up start menu listener first, 
    // then removing that and adding movement listener
    // this.game.player.bindControlHandlers();
    this.game.bindStartHandler();
    this.start();
  }

  start() {
    // setInterval(() => {
    //   this.game.clearNulls();
    //   this.game.updateInformation();
    //   this.game.setEnemies();
    //   this.game.moveObjects();
    //   this.game.draw(this.ctx);
    // }, 20)
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