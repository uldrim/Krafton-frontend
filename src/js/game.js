export const GameState = {
  players: {},
  coins: [],
  scores: {},

  buffer: [],
  BUFFER_SIZE: 50,

  addServerState(serverState) {
    const packet = {
      time: performance.now(),
      players: serverState.players,
      coins: serverState.coins,
      scores: serverState.scores,
    };

    this.buffer.push(packet);
    if (this.buffer.length > this.BUFFER_SIZE) {
      this.buffer.shift();
    }
  },

  updateFromServer(serverState) {
    this.players = serverState.players;
    this.coins = serverState.coins ?? [];
    this.scores = serverState.scores ?? {};
  },
};
