class Game {
  #players;
  #tiles;

  constructor(players) {
    this.#players = players;
    this.#tiles = [];
  }

  #createTilesStack() {
    this.#tiles = ["3A", "2A", "6A", "4B", "9A", "12I"];
  }

  #provideInitialTiles(player) {
    this.#tiles.forEach(tile => player.addTile(tile));
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
