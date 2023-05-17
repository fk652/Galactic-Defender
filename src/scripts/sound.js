class Sound {
  constructor(game) {
    this.waveBGM = document.createElement("audio");
    this.waveBGM.src = "src/assets/sounds/wave_bgm.mp3";
    this.waveBGM.preload = 'auto';
    this.waveBGM.loop = true;

    this.bossIncomingBGM = document.createElement("audio");
    this.bossIncomingBGM.src = "src/assets/sounds/boss_incoming_bgm.mp3";
    this.bossIncomingBGM.preload = 'auto';
    this.bossIncomingBGM.loop = true;

    this.bossBGM = document.createElement("audio");
    this.bossBGM.src = "src/assets/sounds/boss_bgm.mp3"
    this.bossBGM.preload = 'auto';
    this.bossBGM.loop = true;

    this.playerDeathSound = document.createElement("audio");
    this.playerDeathSound.src = "src/assets/sounds/player_death.wav"
    this.playerDeathSound.preload = 'auto';
    this.playerDeathSound.volume = 0.2;

    this.bossDeathSound = document.createElement("audio");
    this.bossDeathSound.src = "src/assets/sounds/boss_death.mp3"
    this.bossDeathSound.preload = 'auto';

    this.gameOverSound = document.createElement("audio");
    this.gameOverSound.src = "src/assets/sounds/game_over.mp3"
    this.gameOverSound.preload = 'auto';

    this.winSound = document.createElement("audio");
    this.winSound.src = "src/assets/sounds/win.mp3"
    this.winSound.preload = 'auto';
    this.winSound.volume = 0.3;

    this.playerHurtSound = document.createElement("audio");
    this.playerHurtSound.src = "src/assets/sounds/player_hurt.wav"
    this.playerHurtSound.preload = 'auto';

    this.audioSources = {
      defaultProjectile: "src/assets/sounds/default_laser.wav",
      playerProjectile: "src/assets/sounds/player_laser.wav",
      enemyProjectile: "src/assets/sounds/enemy_laser.wav",
      bossProjectile: "src/assets/sounds/boss_projectile.wav",
      explosion: "src/assets/sounds/explosion.wav"
    }

    this.currentBGM = this.waveBGM;
    this.currentSounds = [];
    this.toggle = false;
    this.game = game;

    this.soundOnElement = document.getElementById("sound-on");
    this.soundOffElement = document.getElementById("sound-off");
    this.soundTextElement = document.getElementById("sound-text");
    this.bindToggleListener();
  }

  switchBGM(key) {
    this.currentBGM.pause();
    this.currentBGM.currentTime = 0;

    this.currentBGM = this[key];
    if (this.toggle) this.currentBGM.play();
  }

  playPlayerDeathSound() {
    this.currentBGM.pause();
    if (this.toggle) this.playerDeathSound.play();
  }

  playBossDeathSound() {
    this.currentBGM.pause();
    if (this.toggle) this.bossDeathSound.play();
  }

  playGameOverSound() {
    this.currentBGM.pause();
    if (this.toggle) this.gameOverSound.play();
  }

  playWinSound() {
    this.currentBGM.pause();
    if (this.toggle) this.winSound.play();
  }

  playPlayerHurtSound() {
    if (this.toggle) this.playerHurtSound.play();
  }

  toggleOff() {
    this.currentBGM.pause();
    this.reset();
    this.toggle = false;
  }

  toggleOn() {
    if (!this.game.startScreen && !this.game.gameOver && !this.game.win) {
      this.currentBGM.play();
    }
    this.toggle = true;
  }

  add(audioSourceKey) {
    if (this.toggle) {
      const newAudio = document.createElement("audio");
      newAudio.src = this.audioSources[audioSourceKey];
      if (audioSourceKey === "enemyProjectile") newAudio.volume = 0.02;
      this.currentSounds.push(newAudio);
      newAudio.play();
    }
  }

  clear() {
    this.currentSounds = this.currentSounds.filter(sound => !sound.ended);
  }

  reset() {
    this.bossDeathSound.pause();
    this.bossDeathSound.currentTime = 0;

    this.playerDeathSound.pause();
    this.playerDeathSound.currentTime = 0;

    this.gameOverSound.pause();
    this.gameOverSound.currentTime = 0;

    this.winSound.pause();
    this.winSound.currentTime = 0;

    this.playerHurtSound.pause();
    this.playerHurtSound.currentTime = 0;

    this.waveBGM.pause();
    this.waveBGM.currentTime = 0;

    this.bossIncomingBGM.pause();
    this.bossIncomingBGM.currentTime = 0;

    this.bossBGM.pause();
    this.bossBGM.currentTime = 0;

    this.currentSounds.forEach(sound => sound.pause());
    this.currentSounds = [];
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