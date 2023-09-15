const { CORPORATION_TYPES } = require("../constants");

class Corporation {
  #rates;
  #tiles;
  #stocks;
  #isActive;

  constructor(rates, tiles = []) {
    this.#stocks = 25;
    this.#rates = rates;
    this.#tiles = tiles;
    this.#isActive = false;
  }

  // eslint-disable-next-line complexity
  #determineRange() {
    const size = this.#tiles.length;

    switch (true) {
      case size >= 41:
        return "41+";
      case size >= 31:
        return "31-40";
      case size >= 21:
        return "21-30";
      case size >= 11:
        return "11-20";
      case size >= 6:
        return "6-10";
    }

    return size;
  }

  #currentPrice() {
    return this.#rates[this.#determineRange()] || 0;
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
    phoenix: new Corporation(CORPORATION_TYPES.large),
    quantum: new Corporation(CORPORATION_TYPES.large),
    fusion: new Corporation(CORPORATION_TYPES.medium),
    hydra: new Corporation(CORPORATION_TYPES.medium),
    america: new Corporation(CORPORATION_TYPES.medium),
    zeta: new Corporation(CORPORATION_TYPES.small),
    sackson: new Corporation(CORPORATION_TYPES.small),
  };
};

module.exports = { Corporation, createCorporations };
