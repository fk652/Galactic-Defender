import GameView from "./scripts/game_view";

window.canvas = document.getElementById("game-view");
window.ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

const view = new GameView(canvas, ctx);