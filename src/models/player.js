class Player {
  #username;
  #tiles;
  #stocks;
  #balance;
  #isTakingTurn;

  constructor(username, balance = 0, stocks = [], tiles = []) {
    this.#username = username;
    this.#tiles = tiles;
    this.#stocks = stocks;
    this.#balance = balance;
    this.#isTakingTurn = false;
  }

  get username() {
    return this.#username;
  }

  stats() {
    return {
      username: this.#username,
      tiles: [...this.#tiles],
      stocks: { ...this.#stocks },
      balance: this.#balance,
      isTakingTurn: this.#isTakingTurn
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

  startTurn() {
    this.#isTakingTurn = true;
  }

  endTurn() {
    this.#isTakingTurn = false;
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
