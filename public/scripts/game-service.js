export default class GameService {
  #gameGateway;
  #components;

  constructor(gameGateway, components) {
    this.#gameGateway = gameGateway;
    this.#components = components;
  }

  start() {}

  async render() {
    const gameStatus = await this.#gameGateway.getStatus();
    this.#components.balance.update(gameStatus.portfolio.balance);
  }
}
