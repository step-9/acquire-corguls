const { BASE_PRICES } = require("../constants");

class Corporation {
  #name;
  #basePrice;
  #size;
  #stocks;
  #isActive;
  #isSafe;

  constructor(basePrice, size = 0, name = "") {
    this.#stocks = 25;
    this.#basePrice = basePrice;
    this.#size = size;
    this.#isActive = false;
    this.#isSafe = false;
    this.#name = name;
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

  #collapse() {
    this.#size = 0;
    this.#isActive = false;
  }

  acquire(defunct) {
    this.increaseSize(defunct.#size + 1);
    defunct.#collapse();
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

  get isSafe() {
    return this.#isSafe;
  }

  get stocks() {
    return this.#stocks;
  }

  get size() {
    return this.#size;
  }

  get name() {
    return this.#name;
  }

  static fromJSON({ name, basePrice, stocks, size, isActive, isSafe }) {
    const corp = new Corporation();

    corp.#name = name;
    corp.#basePrice = basePrice;
    corp.#size = size;
    corp.#stocks = stocks;
    corp.#isActive = isActive;
    corp.#isSafe = isSafe;

    return corp;
  }
}

const createCorporations = () => {
  const defaultSize = 0;
  return {
    phoenix: new Corporation(BASE_PRICES.large, defaultSize, "phoenix"),
    quantum: new Corporation(BASE_PRICES.large, defaultSize, "quantum"),
    fusion: new Corporation(BASE_PRICES.medium, defaultSize, "fusion"),
    hydra: new Corporation(BASE_PRICES.medium, defaultSize, "hydra"),
    america: new Corporation(BASE_PRICES.medium, defaultSize, "america"),
    zeta: new Corporation(BASE_PRICES.small, defaultSize, "zeta"),
    sackson: new Corporation(BASE_PRICES.small, defaultSize, "sackson"),
  };
};

module.exports = { Corporation, createCorporations };
