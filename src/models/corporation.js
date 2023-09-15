class Corporation {
  // #rates;
  #tiles;
  #stocks;
  #isActive;

  constructor(tiles = []) {
    this.#stocks = 25;
    // this.#rates = rates;
    this.#tiles = tiles;
    this.#isActive = false;
  }

  #currentPrice() {
    return 0;
  }

  decrementStocks(quantity) {
    if (!this.#isActive) return;
    this.#stocks -= quantity;
  }

  establish() {
    this.#isActive = true;
  }

  addTiles(tiles) {
    this.#tiles.push(...tiles);
  }

  stats() {
    return {
      stocks: this.#stocks,
      tiles: [...this.#tiles],
      isActive: this.#isActive,
      price: this.#currentPrice(),
      majority: 2000,
      minority: 1000,
    };
  }

  get isActive() {
    return this.#isActive;
  }

  get stocks() {
    return this.#stocks;
  }
}

const createCorporations = () => {
  return {
    phoenix: new Corporation(),
    quantum: new Corporation(),
    fusion: new Corporation(),
    hydra: new Corporation(),
    america: new Corporation(),
    zeta: new Corporation(),
    sackson: new Corporation(),
  };
};

module.exports = { Corporation, createCorporations };
