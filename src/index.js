import GameView from "./scripts/game_view";

window.canvas = document.getElementById("game-view");
window.ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 550;

const view = new GameView(canvas, ctx);