// Sound class creates and handles all game sounds

class Sound {
  constructor(game) {
    this.game = game;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    
    const soundUrls = {
      // background musics
      waveBGM: "src/assets/sounds/wave_bgm.mp3",
      bossIncomingBGM: "src/assets/sounds/boss_incoming_bgm.mp3",
      bossBGM: "src/assets/sounds/boss_bgm.mp3",

      // major sounds
      playerDeath: "src/assets/sounds/player_death.wav",
      bossDeath: "src/assets/sounds/boss_death.mp3",
      win: "src/assets/sounds/win.mp3",
      gameOver: "src/assets/sounds/game_over.mp3",
      
      // normal sounds
      playerHurt: "src/assets/sounds/player_hurt.wav",
      defaultProjectile: "src/assets/sounds/default_laser.wav",
      playerProjectile: "src/assets/sounds/player_laser.wav",
      enemyProjectile: "src/assets/sounds/enemy_laser.wav",
      bossProjectile: "src/assets/sounds/boss_projectile.wav",
      explosion: "src/assets/sounds/explosion.wav"
    };

    // create audio buffers from each sound file and save as a Sound class property
    (async () => {
      for (const key in soundUrls) {
        const url = soundUrls[key];
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        this[key] = audioBuffer;
      }
    })();

    this.currentBGM = "waveBGM";
    this.bgm = null;
    this.bgmPlaying = false;

    this.soundId = 0;
    this.currentSounds = {};

    this.toggle = false;
    this.soundOnElement = document.getElementById("sound-on");
    this.soundOffElement = document.getElementById("sound-off");
    this.soundTextElement = document.getElementById("sound-text");
    this.bindToggleListener();
  }

  // switching the background music, and play on loop
  // also used to play same background music again after stopping
  switchBGM(key) {
    this.currentBGM = key;

    if (!this.toggle) return;

    this.stopBGM();
    this.bgm = this.audioCtx.createBufferSource();
    this.bgm.buffer = this[key];
    this.bgm.connect(this.audioCtx.destination);
    this.bgm.loop = true;
    this.bgm.start(0);
    this.bgmPlaying = true;
  }

  stopBGM() {
    if (!this.bgmPlaying) return;

    this.bgm.stop();
    // this.bgm.disconnect(this.audioCtx.destination);
    this.bgm = null;
    this.bgmPlaying = false;
  }

  // major sounds will stop background music before playing
  playMajorSound(key) {
    if (!this.toggle) return;
    
    this.stopBGM();
    this.add(key);
  }

  // all currently playing normal sounds are kept track of with ids in this.currentSounds
  // deletes itself from this.currentSounds after finished playing
  // to be called in other classes as needed
  add(key) {
    if (!this.toggle) return;

    const newAudio = this.audioCtx.createBufferSource();
    newAudio.buffer = this[key];
    const newAudioVolume = this.audioCtx.createGain();
    newAudio.connect(newAudioVolume).connect(this.audioCtx.destination);

    if (key === "enemyProjectile") newAudioVolume.gain.value = 0.04;
    else if (key === "playerDeath") newAudioVolume.gain.value = 0.2;
    else if (key === "win") newAudioVolume.gain.value = 0.3;
    else newAudioVolume.gain.value = 1.0;

    const id = this.soundId++
    const audioObject = {
      audio: newAudio,
      volume: newAudioVolume
    }
    this.currentSounds[id] = audioObject;
    
    newAudio.onended = () => {
      if (this.currentSounds[id]) {
        // newAudioVolume.disconnect(this.audioCtx.destination);
        delete this.currentSounds[id];
      }
    }

    newAudio.start(0);
  }
  
  clearCurrentSounds() {
    for (const id in this.currentSounds) {
      const soundObject = this.currentSounds[id];
      soundObject.audio.stop();
      // soundObject.volume.disconnect(this.audioCtx.destination);
      soundObject.audio = null;
      soundObject.volume = null;
      delete this.currentSounds[id];
    }
  }

  // sound toggling
  toggleOff() {
    if (this.audioCtx.state !== "suspended") this.audioCtx.suspend();
    this.toggle = false;
    this.stopBGM();
    this.clearCurrentSounds();
  }

  toggleOn() {
    if (this.audioCtx.state === "suspended") this.audioCtx.resume();
    this.toggle = true;

    if (!this.game.startScreen && !this.game.gameOver && !this.game.win) {
      this.switchBGM(this.currentBGM);
    }
  }

  reset() {
    this.switchBGM("waveBGM");
    this.clearCurrentSounds();
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