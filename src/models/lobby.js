class Lobby {
  #players;
  #size;
  #game;

  constructor(size) {
    this.#players = [];
    this.#size = size;
    this.#game = null;
  }

  addPlayer(player) {
    this.#players.push(player);
  }

  isFull() {
    return this.#players.length === this.#size;
  }

  startGame(game) {
    this.#game = game;
    this.#game.start();
  }

  #hasGameStarted() {
    return this.#game !== null;
  }

  status() {
    return {
      players: this.#players.map(player => ({ ...player })),
      isFull: this.isFull(),
      hasGameStarted: this.#hasGameStarted(),
    };
  }
}

module.exports = Lobby;
