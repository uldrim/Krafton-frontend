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
    GameState.updateFromServer(state);
  });
}

export function sendInput() {
  if (socket) {
    socket.emit("input", inputState);
  }
}
