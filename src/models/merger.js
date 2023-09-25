const { groupBy, sortBy } = require("lodash");

class Merger {
  #playersCount;
  #defunct;
  #acquirer;
  #playerIndex;
  #corporations;
  #connectedTiles;
  #rounds;

  constructor(playersCount, corporations, connectedTiles) {
    this.#rounds = [];
    this.#playerIndex = 0;
    this.#playersCount = playersCount;
    this.#corporations = corporations;
    this.#connectedTiles = connectedTiles;
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
  }

  hasEnd() {
    return this.#playerIndex === this.#playersCount;
  }

  start() {
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
  }

  deal(player, sellQuantity, tradeQuantity) {
    this.sell(player, sellQuantity);
    this.trade(player, tradeQuantity);
    this.#rounds.push({
      trade: tradeQuantity,
      sell: sellQuantity,
      player: player.username,
    });
  }

  get acquirer() {
    return this.#acquirer.name;
  }

  get defunct() {
    return this.#defunct.name;
  }

  getTurns() {
    return this.#rounds;
  }
}

module.exports = Merger;
