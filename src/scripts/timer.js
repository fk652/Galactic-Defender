// Timer class wraps setTimeouts with added pause and resume functionality
class Timer {
  constructor(game, callback, delay) {
    // all Timers are kept tracked of in Game.timers
    this.game = game;
    this.id = this.game.idCounter++;
    this.game.timers[this.id] = this;

    //  Timers will also delete themselves after the callback is played
    this.timerCallback = () => {
      callback();
      delete this.game.timers[this.id];
    }

    this.startTime = Date.now();
    this.delay = delay;
    this.timeoutId = setTimeout(this.timerCallback.bind(this), this.delay);
  }

  // pause and resume simply clear and create setTimeouts with new remaining delays
  pause() {
    clearTimeout(this.timeoutId);
    this.delay -= Date.now() - this.startTime;
  }

  resume() {
    this.startTime = Date.now();
    this.timeoutId = setTimeout(this.timerCallback.bind(this), this.delay)
  }

  clear() {
    clearTimeout(this.timeoutId);
    delete this.game.timers[this.id];
  }
}

export default Timer;