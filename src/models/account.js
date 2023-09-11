class Account {
  #tiles;
  #stocks;
  #balance;

  constructor(balance = 0, stocks = []) {
    this.#tiles = [];
    this.#stocks = stocks;
    this.#balance = balance;
  }

  stats() {
    return {
      tiles: [...this.#tiles],
      stocks: { ...this.#stocks },
      balance: this.#balance,
    };
  }

  credit(amount) {
    this.#balance += amount;
  }

  debit(amount) {
    this.#balance -= amount;
  }

  addTile(tile) {
    this.#tiles.push(tile);
  }

  removeTile(selectedTile) {
    this.#tiles = this.#tiles.filter(tile => tile !== selectedTile);
  }
}

module.exports = { Account };
