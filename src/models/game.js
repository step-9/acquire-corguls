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
    const range = limit => new Array(limit).fill().map((_, i) => i);
    this.#tiles = range(9).flatMap(x =>
      range(12).map(y => ({ position: { x, y }, isPlaced: false }))
    );
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

  #addToIncorporatedTiles(tile) {
    this.#incorporatedTiles.push(tile);
  }

  placeTile(username, position) {
    const player = this.#players.find(player => player.username === username);
    const tile = { position, isPlaced: true };
    this.#addToIncorporatedTiles(tile);
    player.placeTile(position);
    this.#state = "tile-placed";
  }

  start() {
    this.#players[0].startTurn(); // Temporary
    this.#createTilesStack();
    this.#suffleTiles();
    this.#provideInitialAsset();
    this.#state = "place-tile";
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
