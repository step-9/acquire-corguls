class Game {
  #players;
  #tiles;

  constructor(players) {
    this.#players = players;
    this.#tiles = [];
  }

  #createTilesStack() {
    const range = limit => new Array(limit).fill().map((_, i) => i);
    this.#tiles = range(12).flatMap(x => range(9).map(y => ({ x, y })));
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

  start() {
    this.#createTilesStack();
    this.#provideInitialAsset();
  }

  playerDetails(username) {
    const player = this.#players.find(player => player.username === username);
    return player.profile();
  }
}

module.exports = {
  Game,
};
