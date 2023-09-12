class Player {
  #username;
  #tiles;
  #stocks;
  #balance;

  constructor(username, balance = 0, stocks = [], tiles = []) {
    this.#username = username;
    this.#tiles = tiles;
    this.#stocks = stocks;
    this.#balance = balance;
  }

  profile() {
    return {
      username: this.#username,
      tiles: [...this.#tiles],
      stocks: { ...this.#stocks },
      balance: this.#balance,
    };
  }

  addIncome(amount) {
    this.#balance += amount;
  }

  addExpense(amount) {
    this.#balance -= amount;
  }

  addTile(tile) {
    this.#tiles.push(tile);
  }

  removeTile(selectedTile) {
    this.#tiles = this.#tiles.filter(tile => tile !== selectedTile);
  }
}

module.exports = { Player };
