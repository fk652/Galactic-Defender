import GameView from "./scripts/game_view";

window.canvas = document.getElementById("game-view");
window.ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

const view = new GameView(canvas, ctx);

// document.addEventListener('keydown', e => console.log(e));
// canvas.addEventListener('click', e => console.log('fire'));