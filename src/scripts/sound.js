class Sound {
  constructor(game) {
    this.waveBGM = document.createElement("audio");
    this.waveBGM.src = "src/sounds/wave_bgm.mp3";
    this.waveBGM.preload = 'auto';
    this.waveBGM.loop = true;

    this.bossIncomingBGM = document.createElement("audio");
    this.bossIncomingBGM.src = "src/sounds/boss_incoming_bgm.mp3";
    this.bossIncomingBGM.preload = 'auto';
    this.bossIncomingBGM.loop = true;

    this.bossBGM = document.createElement("audio");
    this.bossBGM.src = "src/sounds/boss_bgm.mp3"
    this.bossBGM.preload = 'auto';
    this.bossBGM.loop = true;

    this.playerDeathSound = document.createElement("audio");
    this.playerDeathSound.src = "src/sounds/player_death.wav"
    this.playerDeathSound.preload = 'auto';

    this.bossDeathSound = document.createElement("audio");
    this.bossDeathSound.src = "src/sounds/boss_death.mp3"
    this.bossDeathSound.preload = 'auto';

    this.gameOverSound = document.createElement("audio");
    this.gameOverSound.src = "src/sounds/game_over.mp3"
    this.gameOverSound.preload = 'auto';

    this.winSound = document.createElement("audio");
    this.winSound.src = "src/sounds/win.mp3"
    this.winSound.preload = 'auto';

    this.playerHurtSound = document.createElement("audio");
    this.playerHurtSound.src = "src/sounds/player_hurt.wav"
    this.playerHurtSound.preload = 'auto';

    this.audioSources = {
      defaultProjectile: "src/sounds/default_laser.wav",
      playerProjectile: "src/sounds/player_laser.wav",
      enemyProjectile: "src/sounds/enemy_laser.wav",
      bossProjectile: "src/sounds/boss_projectile.wav",
      explosion: "src/sounds/explosion.wav"
    }

    this.currentBGM = this.waveBGM;
    this.currentSounds = [];
    // this.toggle = false;
    this.toggle = true;
    this.game = game;

    this.bindToggleListener();
  }

  switchBGM(key) {
    this.currentBGM.pause();
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
    this.currentSounds.forEach(sound => sound.pause());
    this.currentSounds = [];
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
      this.currentSounds.push(newAudio);
      newAudio.play();
    }
  }

  clear() {
    this.currentSounds = this.currentSounds.filter(sound => !sound.ended);
  }

  bindToggleListener() {

  }

  handleToggle() {

  }
}

export default Sound;