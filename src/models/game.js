const { range } = require("lodash");

class Game {
  #tiles;
  #state;
  #shuffle;
  #players;
  #incorporatedTiles;

  constructor(players, shuffle) {
    this.#tiles = [];
    this.#incorporatedTiles = [];
    this.#players = players;
    this.#shuffle = shuffle;
  }

  #createTilesStack() {
    this.#tiles = range(9).flatMap(x =>
      range(12).map(y => ({ position: { x, y }, isPlaced: false }))
    );
  }

  #pickTile() {
    return this.#tiles.shift();
  }

  #provideInitialTiles(player, quantity = 6) {
    this.#tiles.splice(0, quantity).forEach(tile => player.addTile(tile));
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

  #addToIncorporatedTiles(tile) {
    tile.isPlaced = true;
    this.#incorporatedTiles.push(tile);
  }

  placeTile(username, position) {
    const player = this.#players.find(player => player.username === username);
    const tile = { position, isPlaced: true };
    this.#addToIncorporatedTiles(tile);
    player.placeTile(position);
    this.#state = "tile-placed";
  }

  #decidePlayingOrder() {
    const firstTiles = this.#players.map(player =>
      [player, this.#pickTile()]);

    firstTiles.sort(([, a], [, b]) => {
      return a.position.x - b.position.x || a.position.y - b.position.y;
    });

    this.#players = firstTiles.map(([a]) => a);
    firstTiles.forEach(([, tilePosition]) =>
      this.#addToIncorporatedTiles(tilePosition));
  }

  start() {
    this.#createTilesStack();
    this.#suffleTiles();
    this.#provideInitialAsset();
    this.#state = "place-tile";
    this.#decidePlayingOrder();
    this.#players[0].startTurn();
  }

  playerDetails(username) {
    // TODO: make it private
    const player = this.#players.find(player => player.username === username);
    return player.portfolio();
  }

  #getPlayers(username) {
    return this.#players.map(player => ({
      username: player.username,
      isTakingTurn: player.isTakingTurn,
      you: player.username === username,
    }));
  }

  status(username) {
    return {
      state: this.#state,
      tiles: {
        incorporatedTiles: this.#incorporatedTiles,
      },
      players: this.#getPlayers(username),
      portfolio: this.playerDetails(username),
    };
  }
}

module.exports = {
  Game,
};
