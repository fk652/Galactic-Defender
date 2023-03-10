import GameView from "./scripts/game_view";

window.canvas = document.getElementById("game-view");
window.ctx = canvas.getContext("2d");
canvas.width = 550;
canvas.height = 700;

const view = new GameView(canvas, ctx);
view.start();

// document.addEventListener('keydown', e => console.log(e));
// canvas.addEventListener('click', e => console.log('fire'));