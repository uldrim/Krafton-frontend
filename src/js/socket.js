import { GameState } from "./game.js";
import { inputState } from "./input.js";

export let socket = null;

export function initSocket() {
  socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log(`Connected: ${socket.id}`);
    socket.emit("join_game");
  });

  socket.on("joined", (data) => {
    console.log(`Joined game: ${data.id}`);
  });

  socket.on("state", (state) => {
    setTimeout(() => {
      GameState.addServerState(state);
    }, 200);
  });
}

export function sendInput() {
  if (socket) {
    setTimeout(() => {
      socket.emit("input", inputState);
    }, 200);
  }
}
