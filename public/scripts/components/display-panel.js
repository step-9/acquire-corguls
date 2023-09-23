export default class DisplayPanel {
  #displayPanelElement;
  #currentTurn;
  #previousTurn;
  #activeViewRenderers;
  #gameStatus;
  #cardGenerators;

  constructor(
    displayPanelElement,
    gameStatus,
    activeViewRenderers,
    cardGenerators
  ) {
    this.#displayPanelElement = displayPanelElement;
    this.#gameStatus = gameStatus;
    this.#currentTurn = gameStatus.turns.currentTurn;
    this.#previousTurn = gameStatus.turns.previousTurn;
    this.#activeViewRenderers = activeViewRenderers;
    this.#cardGenerators = cardGenerators;
    this.#render();
  }

  #renderActiveView() {
    const lastActivity = this.#currentTurn.activities.at(-1).id;
    const { activityConsole } = this.#displayPanelElement;
    const renderer = this.#activeViewRenderers[lastActivity];
    console.log(lastActivity, renderer);
    renderer(this.#gameStatus, activityConsole);
  }

  #renderPreviousActivities() {
    if (!this.#previousTurn) return;
    // render history pane
  }

  #renderCardView() {
    const { activityConsole } = this.#displayPanelElement;

    console.log(this.#currentTurn.activities);
    const cards = this.#currentTurn.activities.map(({ id, data }) => {
      const cardGenerator = this.#cardGenerators[id];
      return cardGenerator(data);
    });

    activityConsole.append(...cards);
  }

  #renderCurrentActivities() {
    this.#displayPanelElement.activityConsole.innerHTML = "";
    if (this.#currentTurn.player.you) return this.#renderActiveView();

    this.#renderCardView();
  }

  #render() {
    this.#renderPreviousActivities();
    this.#renderCurrentActivities();
  }

  update(gameStatus) {
    const { currentTurn, previousTurn } = gameStatus.turns;
    const updatedCurrentPlayer = currentTurn.player.username;
    const currentPlayer = this.#currentTurn.player.username;
    const lastActivity = this.#currentTurn.activities.at(-1).id;
    const updatedLastActivity = currentTurn.activities.at(-1).id;

    console.log({ lastActivity, updatedLastActivity });

    const hasActivitiesUpdated = lastActivity !== updatedLastActivity;
    const hasTurnChanged = currentPlayer !== updatedCurrentPlayer;

    // if activity not updated then return except activity is merge

    if (lastActivity !== "merge" && !hasActivitiesUpdated) return;
    console.log("should render ");

    this.#gameStatus = gameStatus;

    if (hasTurnChanged) {
      this.#currentTurn = currentTurn;
      this.#previousTurn = previousTurn;
      this.#render();
      return;
    }

    this.#currentTurn.activities = currentTurn.activities;
    this.#renderCurrentActivities();
  }
}
