export const GameState = {
  players: {},

  updateFromServer(serverState) {
    this.players = serverState.players;
  },
};
