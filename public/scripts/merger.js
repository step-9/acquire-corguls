const getDisplayPanel = () => document.querySelector("#display-panel");
const generateMergeMsg = (acquirer, defunct) =>
  `${acquirer} is acquiring ${defunct}`;

class Merger {
  constructor() {}
}

const endMergerTurn = () => {
  fetch("/game/merger/end-turn", { method: "POST" });
};

const dealDefunctStocks = () => {
  fetch("/game/merger/deal", { method: "POST" });
};

export const renderMerge = (acquirer, defunct) => {
  const displayPanel = getDisplayPanel();
  const sellAllBtn = generateComponent(["button", "Sell All"]);
  const holdAllBtn = generateComponent(["button", "Hold All"]);
  const mergeOptions = generateComponent(["div", "", { class: "flex" }]);
  const mergeMsg = generateComponent([
    "h4",
    generateMergeMsg(acquirer, defunct),
  ]);

  sellAllBtn.onclick = dealDefunctStocks;
  holdAllBtn.onclick = endMergerTurn;

  displayPanel.innerHTML = "";
  mergeOptions.append(sellAllBtn, holdAllBtn);
  displayPanel.append(mergeMsg, mergeOptions);
};
