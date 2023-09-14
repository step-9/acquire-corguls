class Game {
  #players;
  #tiles;
  #shuffle;

  constructor(players, shuffle) {
    this.#tiles = [];
    this.#players = players;
    this.#shuffle = shuffle;
  }

  #createTilesStack() {
    const range = limit => new Array(limit).fill().map((_, i) => i);
    this.#tiles = range(9).flatMap(x => range(12).map(y => ({ x, y })));
  }

  #provideInitialTiles(player) {
    this.#tiles.splice(0, 6).forEach(tile => player.addTile(tile));
  }

  #provideInitialAsset() {
    const initialAmount = 6000;
    this.#players.forEach(player => {
      player.addIncome(initialAmount);
      this.#provideInitialTiles(player);
    });
  }

  #suffleTiles() {
    this.#tiles = this.#shuffle(this.#tiles);
  }

  start() {
    this.#createTilesStack();
    this.#suffleTiles();
    this.#provideInitialAsset();
  }

  playerDetails(username) { // TODO: make it private
    const player = this.#players.find(player => player.username === username);
    return player.stats();
  }

  #getPlayers() {
    return this.#players.map(({ username, isTakingTurn }) =>
      ({ username, isTakingTurn }));
  }

  status(username) {
    return {
      players: this.#getPlayers(),
      portfolio: this.playerDetails(username),
    };
  }
}

module.exports = {
  Game,
};
