export const inputState = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export function initInput(onInputChange) {
  window.addEventListener("keydown", (e) => {
    updateState(e, true);
    onInputChange();
  });

  window.addEventListener("keyup", (e) => {
    updateState(e, false);
    onInputChange();
  });
}

function updateState(e, isDown) {
  if (e.key === "ArrowUp") inputState.up = isDown;
  if (e.key === "ArrowDown") inputState.down = isDown;
  if (e.key === "ArrowLeft") inputState.left = isDown;
  if (e.key === "ArrowRight") inputState.right = isDown;
}
