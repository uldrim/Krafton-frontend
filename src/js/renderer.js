import { GameState } from "./game.js";

export function initRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Players
    for (const id in GameState.players) {
      const p = GameState.players[id];
      if (!p) continue;

      ctx.fillStyle = id === socketId ? "yellow" : "cyan";
      ctx.fillRect(p.x, p.y, 30, 30);
    }
    requestAnimationFrame(draw);
  }
  draw();
}

export let socketId = null;
export function setSocketId(id) {
  socketId = id;
}
