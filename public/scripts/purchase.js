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
  #totalPrice;

  constructor({ corporations, portfolio }, displayPanel, getCorporation) {
    this.#portfolio = portfolio;
    this.#corporations = corporations;
    this.#cart = {};
    this.#displayPanel = displayPanel;
    this.#getCorporation = getCorporation;
  }

  #selectStocks() {
    const activeCorporations = Object.entries(this.#corporations).filter(
      ([, corp]) => corp.isActive && corp.stocks >= 3
    );

    if (activeCorporations.length === 0) return renderTilePlacedMessage();

    activeCorporations
      .map(([name, { price }]) => {
        const corp = this.#getCorporation(name);
        corp.onclick = () => {
          this.addToCart(name, price * 3, 3);

          if (this.#portfolio.balance >= this.#cart.price) {
            this.#confirmButton.removeAttribute("disabled");
            this.#confirmButton.classList.remove("disable-btn");
          }
        };

        return corp;
      })
      .forEach(corp => corp.classList.remove("non-selectable"));

    getCorporations().classList.add("selectable");
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
    const stockBuyingPrompt = document.createElement("div");

    stockBuyingPrompt.classList.add("buying-prompt");
    stockBuyingPrompt.append(...this.#generateConfirmCancel());

    this.#displayPanel.innerHTML = "";
    this.#totalPrice.innerText = `Total: $${this.#cart.price}`;
    this.#displayPanel.append(cartElement, stockBuyingPrompt);
  }

  #generateConfirmCancel() {
    this.#totalPrice = generateComponent(["p", "Total: $0"]);

    this.#confirmButton = generateComponent([
      "button",
      "Confirm",
      { type: "button", "disabled": true, class: "disable-btn" },
    ]);

    this.#confirmButton.onclick = () => {
      if (this.#cart.quantity > 0) {
        this.#confirmPurchase();
        refillTile();
        //create transaction slip, activity log
        return;
      }
    };

    const skipButton = generateComponent([
      "button",
      "Skip",
      { type: "button", onclick: "refillTile()" },
    ]);

    return [this.#totalPrice, this.#confirmButton, skipButton];
  }

  #renderStockSelection() {
    const stockBuyingPrompt = document.createElement("div");

    stockBuyingPrompt.classList.add("buying-prompt");
    stockBuyingPrompt.append(...this.#generateConfirmCancel());

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
