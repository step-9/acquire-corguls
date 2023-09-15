const { range } = require("lodash");
const GAME_STATES = {
  setup: "setup",
  placeTile: "place-tile",
  tilePlaced: "tile-placed",
};

class Game {
  #tiles;
  #state;
  #shuffle;
  #players;
  #incorporatedTiles;
  #setupTiles;
  #turns;

  constructor(players, shuffle) {
    this.#tiles = [];
    this.#incorporatedTiles = [];
    this.#players = players;
    this.#shuffle = shuffle;
    this.#state = GAME_STATES.setup;
    this.#turns = 0;
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

  #shuffleTiles() {
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
    this.#state = GAME_STATES.tilePlaced;
  }

  #decidePlayingOrder() {
    this.#setupTiles = this.#players.map(player => [player, this.#pickTile()]);

    const firstTiles = this.#setupTiles.toSorted(([, a], [, b]) => {
      return a.position.x - b.position.x || a.position.y - b.position.y;
    });

    this.#players = firstTiles.map(([a]) => a);
    firstTiles.forEach(([, tilePosition]) =>
      this.#addToIncorporatedTiles(tilePosition)
    );
  }

  #currentPlayer() {
    return this.#players[this.#turns % this.#players.length];
  }

  setup() {
    this.#createTilesStack();
    this.#shuffleTiles();
    this.#provideInitialAsset();
    this.#decidePlayingOrder();
  }

  start() {
    this.setup();
    this.#state = GAME_STATES.placeTile;
    this.#currentPlayer().startTurn();
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

  changeTurn() {
    this.#currentPlayer().endTurn();
    this.#turns++;
    this.#currentPlayer().startTurn();
    this.#state = GAME_STATES.placeTile;
    // refill
  }

  status(username) {
    return {
      state: this.#state,
      setupTiles: this.#setupTiles.map(([player, tile]) => [
        player.username,
        tile,
      ]),
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
