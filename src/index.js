import GameView from "./scripts/game_view";

const preloadedImages = [];
const imageUrls = [
  "src/assets/images/boss1.png",
  "src/assets/images/enemy_projectile.png",
  "src/assets/images/enemy1.png",
  "src/assets/images/enemy2.png",
  "src/assets/images/enemy3.png",
  "src/assets/images/player_projectile.png",
  "src/assets/images/player1.png",
  "src/assets/images/game_background.png",
  "src/assets/images/explosion1.png",
  "src/assets/images/explosion2.png"
]

imageUrls.forEach((url, i) => {
  preloadedImages[i] = new Image();
  preloadedImages[i].src = url;
})

const preloadedSounds = [];
const soundsUrls = [
  "src/assets/sounds/boss_bgm.mp3",
  "src/assets/sounds/boss_death.mp3",
  "src/assets/sounds/boss_incoming_bgm.mp3",
  "src/assets/sounds/boss_projectile.wav",
  "src/assets/sounds/default_laser.wav",
  "src/assets/sounds/enemy_laser.wav",
  "src/assets/sounds/explosion.wav",
  "src/assets/sounds/game_over.mp3",
  "src/assets/sounds/player_death.wav",
  "src/assets/sounds/player_hurt.wav",
  "src/assets/sounds/player_laser.wav",
  "src/assets/sounds/wave_bgm.mp3",
  "src/assets/sounds/win.mp3"
]

soundsUrls.forEach((url, i) => {
  preloadedSounds[i] = new Audio();
  preloadedSounds[i].src = url;
})

window.addEventListener("load", () => {
  window.canvas = document.getElementById("game-view");
  window.ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 550;
  const view = new GameView(canvas, ctx);
  view.start()
});
