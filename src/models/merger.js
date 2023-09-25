const { groupBy, sortBy } = require("lodash");
const { TurnManager, ACTIVITIES } = require("./turn-manager");

class Merger {
  #playersCount;
  #defunct;
  #acquirer;
  #playerIndex;
  #corporations;
  #connectedTiles;
  #turnManager;

  constructor(playersCount, corporations, connectedTiles) {
    this.#playerIndex = 0;
    this.#playersCount = playersCount;
    this.#corporations = corporations;
    this.#connectedTiles = connectedTiles;
    this.#turnManager = new TurnManager();
  }

  #findAcquirerAndDefunct() {
    const corporatedTiles = this.#connectedTiles.filter(
      ({ belongsTo }) => belongsTo !== "incorporated"
    );

    const groupedTiles = groupBy(corporatedTiles, "belongsTo");
    const corps = Object.keys(groupedTiles).map(
      name => this.#corporations[name]
    );
    const [acquirer, defunct] = sortBy(corps, corp => corp.size).reverse();

    this.#defunct = defunct;
    this.#acquirer = acquirer;
  }

  endTurn() {
    this.#playerIndex++;
    this.#turnManager.changeTurn();
    this.#turnManager.initiateActivity(ACTIVITIES.deal);
  }

  hasEnd() {
    return this.#playerIndex === this.#playersCount;
  }

  start() {
    this.#turnManager.initiateActivity(ACTIVITIES.deal);
    this.#findAcquirerAndDefunct();
  }

  end() {
    this.#acquirer.acquire(this.#defunct);

    this.#connectedTiles.forEach(
      tile => (tile.belongsTo = this.#acquirer.name)
    );

    if (this.#acquirer.stats().size > 10) this.#acquirer.markSafe();
  }

  sell(player, quantity) {
    const { stocks } = player.portfolio();
    const { price } = this.#defunct.stats();
    const totalQuantity = stocks[this.defunct];

    if (quantity > totalQuantity) return;
    player.sellStocks(this.defunct, quantity);
    player.addIncome(quantity * price);
    this.#defunct.incrementStocks(quantity);
    this.#turnManager.consolidateActivity({ quantity });
  }

  trade(player, quantity) {
    const { stocks } = player.portfolio();
    const totalQuantity = stocks[this.defunct];
    const tradedQuantity = quantity / 2;

    const cannotTrade =
      quantity > totalQuantity || tradedQuantity > this.#acquirer.stocks;

    if (cannotTrade) return;
    player.sellStocks(this.defunct, quantity);
    player.addStocks(this.acquirer, tradedQuantity);
    this.#defunct.incrementStocks(quantity);
    this.#acquirer.decrementStocks(tradedQuantity);
    this.#turnManager.consolidateActivity({ quantity });
  }

  get acquirer() {
    return this.#acquirer.name;
  }

  get defunct() {
    return this.#defunct.name;
  }

  getTurns() {
    return this.#turnManager.getTurns();
  }
}

module.exports = Merger;
