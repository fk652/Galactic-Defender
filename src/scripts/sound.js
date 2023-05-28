// Sound class creates and handles all game sounds
class Sound {
  constructor(game) {
    this.audioCtx = new AudioContext();
    
    this.waveBGM = "src/assets/sounds/wave_bgm.mp3";
    this.bossIncomingBGM = "src/assets/sounds/boss_incoming_bgm.mp3";
    this.bossBGM = "src/assets/sounds/boss_bgm.mp3";

    this.currentBGM = document.createElement("audio");
    this.currentBGM.src = this.waveBGM;
    this.currentBGM.loop = true;
    this.currentBGMCtx = this.audioCtx.createMediaElementSource(this.currentBGM);
    this.currentBGMCtx.connect(this.audioCtx.destination);
    
    this.playerHurt = "src/assets/sounds/player_hurt.wav";
    this.playerDeath = "src/assets/sounds/player_death.wav";
    this.bossDeath = "src/assets/sounds/boss_death.mp3";
    this.win = "src/assets/sounds/win.mp3";
    this.gameOver = "src/assets/sounds/game_over.mp3";

    this.majorSound = document.createElement("audio");
    this.majorSound.src = "";
    this.majorSound.onended = () => this.majorSound.src = "";
    this.majorSoundCtx = this.audioCtx.createMediaElementSource(this.majorSound);
    this.majorSoundCtx.connect(this.audioCtx.destination);

    this.defaultProjectile = "src/assets/sounds/default_laser.wav";
    this.playerProjectile = "src/assets/sounds/player_laser.wav";
    this.enemyProjectile = "src/assets/sounds/enemy_laser.wav";
    this.bossProjectile = "src/assets/sounds/boss_projectile.wav";
    this.explosion = "src/assets/sounds/explosion.wav";

    this.soundId = 0;
    this.currentSounds = {};
    this.toggle = false;
    this.game = game;

    this.soundOnElement = document.getElementById("sound-on");
    this.soundOffElement = document.getElementById("sound-off");
    this.soundTextElement = document.getElementById("sound-text");
    this.bindToggleListener();
  }

  // only pause when playing, to avoid asynchronous play() issues
  isPlaying(audio) {
    return audio.currentTime > 0 && !audio.paused && !audio.ended;
  }

  // switching the background music
  switchBGM(key) {
    this.currentBGM.pause();
    this.currentBGM.currentTime = 0;
    this.currentBGM.src = this[key];
    if (this.toggle) this.currentBGM.play();
  }

  // player hurt, player death, boss death, win, game over sounds
  playMajorSound(key) {
    if (key === null) {
      this.majorSound.src = ""
      return;
    }

    if (key !== "playerHurt") this.currentBGM.pause();

    this.majorSound.pause();
    this.majorSound.currentTime = 0;
    this.majorSound.src = this[key];

    if (key === "playerDeath") this.majorSound.volume = 0.2;
    else if (key === "win") this.majorSound.volume = 0.3;
    else this.majorSound.volume = 1.0;

    if (this.toggle) this.majorSound.play();
  }

  // sound toggling
  toggleOff() {
    if (this.audioCtx.state !== "suspended") this.audioCtx.suspend();
    this.currentBGM.pause();
    this.majorSound.pause();
    this.clearCurrentSounds();
    this.toggle = false;
  }

  toggleOn() {
    if (this.audioCtx.state === "suspended") this.audioCtx.resume();
    if (!this.game.startScreen && !this.game.gameOver && !this.game.win) {
      this.currentBGM.play();
    }
    if (!isNaN(this.majorSound.duration)) this.majorSound.play();
    this.toggle = true;
  }

  // adding projectile and explosion sounds, to be called in other classes as needed
  add(audioSourceKey) {
    if (this.toggle) {
      const newAudio = document.createElement("audio");
      newAudio.src = this[audioSourceKey];
      const newAudioCtx = this.audioCtx.createMediaElementSource(newAudio);
      newAudioCtx.connect(this.audioCtx.destination);

      if (audioSourceKey === "enemyProjectile") newAudio.volume = 0.02;

      newAudio.onended = () => {
        newAudioCtx.disconnect(this.audioCtx.destination);
        newAudio.remove();
        newAudio.src = '';
        delete this.currentSounds[id];
      }

      newAudio.play().then(() => { 
        if(!this.toggle) newAudio.pause() 
      }).catch(() => {});

      const id = this.soundId++
      const audioObject = {
        audio: newAudio,
        ctx: newAudioCtx
      }
      this.currentSounds[id] = audioObject;
    }
  }

  reset() {
    this.switchBGM("waveBGM");
    this.playMajorSound(null);
    this.clearCurrentSounds();
  }

  clearCurrentSounds() {
    Object.values(this.currentSounds).forEach(soundObject => {
      if (this.isPlaying(soundObject.audio)) soundObject.audio.pause();
      soundObject.audio.remove();
      soundObject.audio.src = '';
      soundObject.ctx.disconnect(this.audioCtx.destination);
    });
    this.currentSounds = {};
  }

  bindToggleListener() {
    const soundContainer = document.getElementById("sound-icons-container");
    soundContainer.addEventListener("click", this.handleSoundToggle.bind(this));
  }

  handleSoundToggle() {
    if (this.toggle) {
      this.toggleOff()
      this.soundOnElement.style.display = 'none';
      this.soundOffElement.style.display = 'block'; 
      this.soundTextElement.innerHTML = "muted";
    } else {
      this.toggleOn()
      this.soundOnElement.style.display = 'block';
      this.soundOffElement.style.display = 'none';
      this.soundTextElement.innerHTML = "sound on";
    }
  }
}

export default Sound;