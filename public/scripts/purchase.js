const capitaliseFirstLetter = text =>
  text.charAt(0).toUpperCase() + text.slice(1);

class Purchase {
  #cart;
  #portfolio;
  #corporations;
  #displayPanel;
  #getCorporation;
  #activeCorporations;
  #confirmButton;

  constructor({ corporations, portfolio }, displayPanel, getCorporation) {
    this.#portfolio = portfolio;
    this.#corporations = corporations;
    this.#cart = {};
    this.#displayPanel = displayPanel;
    this.#getCorporation = getCorporation;
  }

  // eslint-disable-next-line complexity
  #selectStocks() {
    const activeCorporations = Object.entries(this.#corporations).filter(
      ([, corp]) => corp.isActive && corp.stocks > 0
    );

    if (activeCorporations.length === 0) return renderTilePlacedMessage();

    activeCorporations
      .map(([name, { price }]) => {
        let count = 1;
        const corp = this.#getCorporation(name);
        corp.onclick = () => {
          count--;
          this.addToCart(name, price * 3, 3);

          if (this.#portfolio.balance >= this.#cart.price) {
            this.#confirmButton.removeAttribute("disabled");
            this.#confirmButton.classList.remove("disable-btn");
          }

          console.log(count);
          if (count < 1) {
            console.log("non select");
            corp.classList.add("non-selectable");
            return;
          }
        };

        return corp;
      })
      .forEach(corp => corp.classList.remove("non-selectable"));
  }

  addToCart(name, price, quantity) {
    this.#cart = { name, price, quantity };
    this.#generateCart();
  }

  #confirmPurchase() {
    fetch("/game/buy-stocks", {
      method: "POST",
      body: JSON.stringify(this.#cart),
      headers: {
        "content-type": "application/json",
      },
    });
  }

  skipPurchase() {
    fetch("/game/end-turn", { method: "POST" }).then(() => {
      const tileElements = getTileElements();
      placeNewTile(tileElements);
      setTimeout(() => removeHighlight(tileElements), transitionDelay);
    });
  }

  #generateBuySkip() {
    const buySkipButtons = document.createElement("div");
    const buyButton = generateComponent([
      "button",
      "Buy Stocks",
      { type: "button" },
    ]);

    buyButton.onclick = () => {
      this.#selectStocks();
      this.#renderStockSelection();
    };

    const skipButton = generateComponent([
      "button",
      "Skip",
      { type: "button", onclick: "refillTile()" },
    ]);

    buySkipButtons.append(buyButton, skipButton);

    return [buySkipButtons];
  }

  #renderBuySkip() {
    const stockBuyingPrompt = document.createElement("div");

    stockBuyingPrompt.classList.add("buying-prompt");
    stockBuyingPrompt.append(...this.#generateBuySkip());
    this.#displayPanel.innerHTML = "";
    this.#displayPanel.append(stockBuyingPrompt);
  }

  #generateCart() {
    const stockCard = [
      "div",
      capitaliseFirstLetter(this.#cart.name),
      { class: `${this.#cart.name} stock flex` },
    ];

    const cartElement = document.createElement("div");
    cartElement.append(
      generateComponent(stockCard),
      generateComponent(stockCard),
      generateComponent(stockCard)
    );

    cartElement.classList.add("selected-stocks");
    this.#displayPanel.prepend(cartElement);
  }

  #generateConfirmCancel() {
    const buySkipButtons = document.createElement("div");
    this.#confirmButton = generateComponent([
      "button",
      "Confirm",
      { type: "button", "disabled": true, class: "disable-btn" },
    ]);
    this.#confirmButton.onclick = () => {
      if (this.#cart.quantity > 0) {
        this.#confirmPurchase();
        refillTile();
        return;
      }
    };

    const skipButton = generateComponent([
      "button",
      "Skip",
      { type: "button", onclick: "refillTile()" },
    ]);

    buySkipButtons.append(this.#confirmButton, skipButton);

    return buySkipButtons;
  }

  #renderStockSelection() {
    const stockBuyingPrompt = document.createElement("div");

    stockBuyingPrompt.classList.add("buying-prompt");
    stockBuyingPrompt.append(this.#generateConfirmCancel());

    this.#displayPanel.innerHTML = "";
    this.#displayPanel.append(stockBuyingPrompt);
  }

  render() {
    this.#activeCorporations = Object.entries(this.#corporations).filter(
      ([, corp]) => corp.isActive && corp.stocks > 0
    );

    if (this.#activeCorporations.length === 0) {
      return renderTilePlacedMessage();
    }

    this.#renderBuySkip();
  }
}

const startPurchase = (gameStatus, displayPanel, getCorporation) => {
  const { players, corporations, state } = gameStatus;
  const self = players.find(({ you }) => you);
  const isInCorrectState = "buy-stocks" === state;
  const currentPlayer = players.find(({ isTakingTurn }) => isTakingTurn);

  if (!(isSamePlayer(self, currentPlayer) && isInCorrectState)) return;

  const purchase = new Purchase(gameStatus, displayPanel, getCorporation);
  purchase.render();
};
