const { groupBy, sortBy } = require("lodash");

class Merger {
  #players;
  #corporations;
  #connectedTiles;
  #acquirer;
  #defunct;
  #mergeMakerIndex;
  #playerIndex;

  constructor(players, corporations, connectedTiles, startIndex) {
    this.#players = players;
    this.#corporations = corporations;
    this.#connectedTiles = connectedTiles;
    this.#mergeMakerIndex = startIndex;
    this.#playerIndex = 0;
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

    this.#acquirer = acquirer;
    this.#defunct = defunct;
  }

  currentPlayer() {
    return this.#players[this.#mergeMakerIndex % this.#players.length];
  }

  endTurn() {
    this.#mergeMakerIndex++;
    this.#playerIndex++;
  }

  hasEnd() {
    return this.#playerIndex === this.#players.length;
  }

  start() {
    this.#findAcquirerAndDefunct();
  }

  get acquirer() {
    return this.#acquirer.name;
  }

  get defunct() {
    return this.#defunct.name;
  }
}

module.exports = Merger;
