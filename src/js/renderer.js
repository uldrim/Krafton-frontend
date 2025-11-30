import { GameState } from "./game.js";

export let socketId = null;
export function setSocketId(id) {
  socketId = id;
}

// Player interpolation delay (100ms behind real time)
const RENDER_DELAY = 100;

// --------------------------
// Utility: Linear interpolation
// --------------------------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// --------------------------
// Get two snapshots for player interpolation
// --------------------------
function getInterpolationStates() {
  const buffer = GameState.buffer;
  if (buffer.length < 2) return null;

  const now = performance.now();
  const renderTimestamp = now - RENDER_DELAY;

  // Find two states that surround the render timestamp
  for (let i = buffer.length - 1; i >= 1; i--) {
    const stateAfter = buffer[i];
    const stateBefore = buffer[i - 1];

    if (
      stateBefore.time <= renderTimestamp &&
      renderTimestamp <= stateAfter.time
    ) {
      return { stateBefore, stateAfter, renderTimestamp };
    }
  }

  return null;
}

// --------------------------
// MAIN RENDER LOOP
// --------------------------
export function initRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const latestState = GameState.buffer[GameState.buffer.length - 1] || null;

    const interp = getInterpolationStates();

    // If interpolation not possible yet → draw latest snapshot
    if (!interp || !latestState) {
      if (latestState) {
        drawPlayersRaw(ctx, latestState.players);
        drawCoinsRaw(ctx, latestState.coins); // NO INTERPOLATION
        drawScores(ctx, latestState.scores);
      }
      requestAnimationFrame(draw);
      return;
    }

    // ----- Player interpolation -----
    const { stateBefore, stateAfter, renderTimestamp } = interp;

    const total = stateAfter.time - stateBefore.time;
    const progress = (renderTimestamp - stateBefore.time) / total;
    const t = Math.max(0, Math.min(1, progress)); // clamp 0..1

    const interpolatedPlayers = {};

    for (const id in stateBefore.players) {
      const p1 = stateBefore.players[id];
      const p2 = stateAfter.players[id] || p1; // fallback

      interpolatedPlayers[id] = {
        x: lerp(p1.x, p2.x, t),
        y: lerp(p1.y, p2.y, t),
      };
    }

    // ----- Coins: NO interpolation -----
    // Use latest snapshot ONLY
    drawPlayers(ctx, interpolatedPlayers);
    drawCoinsRaw(ctx, latestState.coins);
    drawScores(ctx, latestState.scores);

    requestAnimationFrame(draw);
  }

  draw();
}

// --------------------------
// Draw Players (interpolated)
// --------------------------
function drawPlayers(ctx, players) {
  if (!players) return;

  for (const id in players) {
    const p = players[id];

    ctx.fillStyle = id === socketId ? "red" : "green";
    ctx.fillRect(p.x, p.y, 30, 30);
  }
}

// --------------------------
// Draw Players (raw fallback)
// --------------------------
function drawPlayersRaw(ctx, players) {
  if (!players) return;

  for (const id in players) {
    const p = players[id];

    ctx.fillStyle = id === socketId ? "yellow" : "cyan";
    ctx.fillRect(p.x, p.y, 30, 30);
  }
}

// --------------------------
// Draw Coins (raw positions)
// --------------------------
function drawCoinsRaw(ctx, coins) {
  if (!coins) return;

  ctx.fillStyle = "gold";

  for (const c of coins) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --------------------------
// Draw Scoreboard
// --------------------------
function drawScores(ctx, scores) {
  if (!scores) return;

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  let y = 20;

  for (const id in scores) {
    const label = id === socketId ? "YOU" : "OPPONENT";
    ctx.fillText(`${label}: ${scores[id]}`, 10, y);
    y += 25;
  }
}
