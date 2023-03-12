import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);

    // to be changed with setting up start menu listener first, 
    // then removing that and adding movement listener
    this.bindControlHandlers();
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

  bindControlHandlers() {
    this.game.player.bindControlHandlers();
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
}

export default GameView;