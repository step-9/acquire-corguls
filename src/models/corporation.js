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
