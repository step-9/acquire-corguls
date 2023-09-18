const { BASE_PRICES } = require("../constants");

class Corporation {
  #basePrice;
  #size;
  #stocks;
  #isActive;
  #isSafe;

  constructor(basePrice, size = 0) {
    this.#stocks = 25;
    this.#basePrice = basePrice;
    this.#size = size;
    this.#isActive = false;
    this.#isSafe = false;
  }

  #range() {
    const size = this.#size;
    const lowerBounds = [41, 31, 21, 11, 6, 5, 4, 3, 2, 0];
    const boundIndex = lowerBounds.findIndex(lowerBound => size >= lowerBound);
    return lowerBounds.length - 1 - boundIndex;
  }

  #price() {
    return this.#size === 0 ? 0 : this.#basePrice + 100 * this.#range();
    // TODO: Refactor it
  }

  decrementStocks(quantity) {
    if (!this.#isActive) return;
    this.#stocks -= quantity;
  }

  establish() {
    this.#isActive = true;
  }

  increaseSize(delta) {
    this.#size += delta;
  }

  markSafe() {
    this.#isSafe = true;
  }

  stats() {
    return {
      stocks: this.#stocks,
      size: this.#size,
      isActive: this.#isActive,
      price: this.#price(),
      majority: 2000,
      minority: 1000,
      isSafe: this.#isSafe,
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
    phoenix: new Corporation(BASE_PRICES.large),
    quantum: new Corporation(BASE_PRICES.large),
    fusion: new Corporation(BASE_PRICES.medium),
    hydra: new Corporation(BASE_PRICES.medium),
    america: new Corporation(BASE_PRICES.medium),
    zeta: new Corporation(BASE_PRICES.small),
    sackson: new Corporation(BASE_PRICES.small),
  };
};

module.exports = { Corporation, createCorporations };
