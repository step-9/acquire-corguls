class Lobby {
  #players;
  #size;
  #game;

  constructor(size) {
    this.#players = new Set();
    this.#size = size;
    this.#game = null;
  }

  addPlayer(player) {
    this.#players.add(player);
  }

  isFull() {
    return this.#players.size === this.#size;
  }

  startGame(game) {
    this.#game = game;
  }

  #hasGameStarted() {
    return this.#game !== null;
  }

  status() {
    return {
      players: [...this.#players].map(player => ({ ...player })),
      isFull: this.isFull(),
      hasGameStarted: this.#hasGameStarted(),
    };
  }
}

module.exports = Lobby;
