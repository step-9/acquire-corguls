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

  get username() {
    return this.#username;
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

const initializeAccountStocks = () => {
  return {
    "phoenix": 0,
    "quantum": 0,
    "hydra": 0,
    "fusion": 0,
    "america": 0,
    "sackson": 0,
    "zeta": 0,
  };
};

const createPlayers = players => {
  const stocks = initializeAccountStocks();
  const balance = 0;
  return players.map(player => new Player(player.username, balance, stocks));
};

module.exports = { createPlayers, Player };
