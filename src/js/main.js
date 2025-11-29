import { initSocket, socket, sendInput } from "./socket.js";
import { initInput } from "./input.js";
import { initRenderer, setSocketId } from "./renderer.js";

const canvas = document.getElementById("gameCanvas");

initSocket();

initInput(() => {
  sendInput();
});

setTimeout(() => {
  if (socket) setSocketId(socket.id);
}, 500);

initRenderer(canvas);
