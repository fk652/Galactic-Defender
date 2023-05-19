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

window.addEventListener("load", () => {
  window.canvas = document.getElementById("game-view");
  window.ctx = canvas.getContext("2d");
  const view = new GameView(canvas, ctx);
  view.start()
});
