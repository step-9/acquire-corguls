import { createCard } from "./game.js";

const endMergerTurn = () => {
  fetch("/game/merger/end-turn", { method: "POST" });
};

export const renderMerge = (
  { turns, portfolio, corporations },
  activityConsole
) => {
  const lastActivity = turns.currentTurn.activities.at(-1);
  const { acquirer: acquirerName, defunct: defunctName } = lastActivity.data;
  const acquirer = corporations[acquirerName];
  const defunct = corporations[defunctName];
  const defunctStocks = portfolio.stocks[defunctName];

  const merger = new Merger(
    { defunctStocks, acquirer, defunct },
    activityConsole
  );
  merger.render();
};

class Merger {
  #cart;
  // #defunct;
  // #acquirer;
  #defunctStocks;
  #activityConsole;

  constructor({ defunctStocks, acquirer, defunct }, activityConsole) {
    this.#cart = { sell: 0, trade: 0 };
    // this.#defunct = defunct;
    // this.#acquirer = acquirer;
    this.#defunctStocks = defunctStocks;
    this.#activityConsole = activityConsole;
  }

  #confirmDeal() {
    fetch("/game/merger/deal", {
      method: "POST",
      body: JSON.stringify(this.#cart),
      headers: {
        "content-type": "application/json",
      },
    });
  }

  #getHeldStocks() {
    return this.#defunctStocks - this.#cart.sell - this.#cart.trade;
  }

  #createBtn(symbol) {
    return generateComponent(["button", symbol, { class: "tile stock-btn" }]);
  }

  #incrementSellCount() {
    if (this.#cart.sell < this.#defunctStocks) this.#cart.sell += 1;
  }

  #decrementSellCount() {
    if (this.#cart.sell > 0) this.#cart.sell -= 1;
  }

  #createHoldBox() {
    return createCard("Hold", [
      ["div", this.#getHeldStocks(), { class: "tile" }],
    ]);
  }

  #createSellBox() {
    const sellCard = createCard("sell");
    const addBtn = this.#createBtn("+");
    const subBtn = this.#createBtn("-");
    const sellBox = generateComponent(["div", "", { class: "sell-box" }]);
    const stockCount = generateComponent([
      "div",
      this.#cart.sell,
      { class: "tile" },
    ]);

    addBtn.onclick = () => {
      this.#incrementSellCount();
      this.render();
    };

    subBtn.onclick = () => {
      this.#decrementSellCount();
      this.render();
    };

    sellBox.append(subBtn, stockCount, addBtn);
    sellCard.lastChild.append(sellBox);

    return sellCard;
  }

  #createDealOptions() {
    const dealOptions = generateComponent([
      "div",
      "",
      { class: "flex deal-options" },
    ]);

    dealOptions.append(this.#createHoldBox(), this.#createSellBox());
    return dealOptions;
  }

  #createButtonSection() {
    const buttonSection = generateComponent(["div", "", { class: "flex" }]);
    const confirmBtn = generateComponent(["button", "Confirm"]);
    const clearBtn = generateComponent(["button", "Clear"]);

    confirmBtn.onclick = () => this.#confirmDeal();
    clearBtn.onclick = () => {
      this.#cart = { sell: 0, trade: 0 };
      this.render();
    };

    buttonSection.append(confirmBtn, clearBtn);

    return buttonSection;
  }

  render() {
    const transactionSection = generateComponent([
      "div",
      "",
      { class: "flex deal-defunct-stocks" },
    ]);

    transactionSection.append(
      this.#createDealOptions(),
      this.#createButtonSection()
    );

    this.#activityConsole.innerHTML = "";
    this.#activityConsole.append(transactionSection);
  }
}
