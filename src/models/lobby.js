class Lobby {
  #hasExpired;
  #players;
  #size;

  constructor(size) {
    this.#players = [];
    this.#hasExpired = false;
    this.#size = size;
  }

  addPlayer(player) {
    this.#players.push(player);
  }

  #isPossibleToStartGame() {
    return this.#players.length >= this.#size.lowerLimit;
  }

  isFull() {
    return this.#players.length === this.#size.upperLimit;
  }

  expire() {
    this.#hasExpired = true;
  }

  status() {
    return {
      players: this.#players.map(player => ({ ...player })),
      isFull: this.isFull(),
      hasExpired: this.#hasExpired,
      isPossibleToStartGame: this.#isPossibleToStartGame(),
    };
  }
}

module.exports = Lobby;
