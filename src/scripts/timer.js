class Timer {
  constructor(game, callback, delay) {
    this.game = game;
    this.id = this.game.idCounter++;
    this.game.timers[this.id] = this;

    this.timerCallback = () => {
      callback();
      delete this.game.timers[this.id];
    }

    this.startTime = Date.now();
    this.delay = delay;
    this.timeoutId = setTimeout(this.timerCallback.bind(this), this.delay);
  }

  pause() {
    clearTimeout(this.timeoutId);
    this.delay -= Date.now() - this.startTime;
  }

  resume() {
    this.startTime = Date.now();
    this.timeoutId = setTimeout(this.timerCallback.bind(this), this.delay)
  }
}

export default Timer;