import GameView from "./scripts/game_view";
// import Sound from "./scripts/sound";

window.canvas = document.getElementById("game-view");
window.ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 550;

const view = new GameView(canvas, ctx);

window.addEventListener("load", () => {
  // console.log("window loaded");
  // const sounds = new Sound();

  // window.canvas = document.getElementById("game-view");
  // window.ctx = canvas.getContext("2d");
  // canvas.width = 700;
  // canvas.height = 550;

  // const view = new GameView(canvas, ctx);
  view.start();
})

// document.addEventListener("DOMContentLoaded", () => {
//   window.canvas = document.getElementById("game-view");
//   window.ctx = canvas.getContext("2d");
//   canvas.width = 700;
//   canvas.height = 550;

//   new GameView(canvas, ctx);
// });