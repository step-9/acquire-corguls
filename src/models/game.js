const { range } = require("lodash");
const GAME_STATES = {
  setup: "setup",
  placeTile: "place-tile",
  tilePlaced: "tile-placed",
  establishCorporation: "establish-corporation",
};

class Game {
  #tiles;
  #state;
  #corporations;
  #shuffle;
  #players;
  #incorporatedTiles;
  #setupTiles;
  #turns;

  constructor(players, shuffle, corporations) {
    this.#tiles = [];
    this.#incorporatedTiles = [];
    this.#corporations = corporations;
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

  #getAdjacentTiles(currentTilePosition) {
    const isHorizontallyAdjacent = (tile1, tile2) =>
      Math.abs(tile1.x - tile2.x) === 1 && Math.abs(tile1.y - tile2.y) === 0;

    const isVerticallyAdjacent = (tile1, tile2) =>
      Math.abs(tile1.x - tile2.x) === 0 && Math.abs(tile1.y - tile2.y) === 1;

    const isAdjacent = (tile1, tile2) =>
      isHorizontallyAdjacent(tile1, tile2) ||
      isVerticallyAdjacent(tile1, tile2);

    return this.#incorporatedTiles.filter(tile =>
      isAdjacent(currentTilePosition, tile.position)
    ); // return obj
  }

  #consolidateTile(position) {
    const tile = { position, isPlaced: true };
    const adjacentTiles = this.#getAdjacentTiles(position);

    console.log(tile, adjacentTiles);
    const foundCorporation = adjacentTiles.every(tile =>
      this.#incorporatedTiles.includes(tile)
    );

    switch (true) {
      case adjacentTiles.length === 0: {
        this.#addToIncorporatedTiles(tile);
        this.#state = GAME_STATES.tilePlaced;
        break;
      }

      case foundCorporation: {
        this.#state = GAME_STATES.establishCorporation;
      }
    }
  }

  placeTile(username, position) {
    const player = this.#players.find(player => player.username === username);
    this.#consolidateTile(position);
    player.placeTile(position);
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

  #refillTile() {
    const newTile = this.#pickTile();
    this.#currentPlayer().refillTile(newTile);
  }

  changeTurn() {
    this.#refillTile();
    this.#currentPlayer().endTurn();
    this.#turns++;
    this.#currentPlayer().startTurn();
    this.#state = GAME_STATES.placeTile;
    // refill
  }

  #getCorporationStats() {
    return Object.fromEntries(
      Object.entries(this.#corporations).map(([name, corporation]) => [
        name,
        corporation.stats(),
      ])
    );
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
      corporations: this.#getCorporationStats(),
    };
  }
}

module.exports = {
  Game,
};
