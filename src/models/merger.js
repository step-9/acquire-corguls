const { groupBy, sortBy } = require("lodash");

class Merger {
  #playersCount;
  #defunct;
  #acquirer;
  #playerIndex;
  #corporations;
  #connectedTiles;

  constructor(playersCount, corporations, connectedTiles) {
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

  get acquirer() {
    return this.#acquirer.name;
  }

  get defunct() {
    return this.#defunct.name;
  }
}

module.exports = Merger;
