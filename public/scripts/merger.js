const generateMergeMsg = (acquirer, defunct) =>
  `${acquirer} is acquiring ${defunct}`;

const endMergerTurn = () => {
  fetch("/game/merger/end-turn", { method: "POST" });
};

const dealDefunctStocks = () => {
  fetch("/game/merger/deal", { method: "POST" });
};

export const renderMerge = ({ turns }, activityConsole) => {
  const lastActivity = turns.currentTurn.activities.at(-1);
  const { acquirer, defunct } = lastActivity.data;
  const sellAllBtn = generateComponent(["button", "Sell All"]);
  const holdAllBtn = generateComponent(["button", "Hold All"]);
  const mergeOptions = generateComponent(["div", "", { class: "flex" }]);
  const mergeMsg = generateComponent([
    "h4",
    generateMergeMsg(acquirer, defunct),
  ]);

  sellAllBtn.onclick = dealDefunctStocks;
  holdAllBtn.onclick = endMergerTurn;

  activityConsole.innerHTML = "";
  mergeOptions.append(sellAllBtn, holdAllBtn);
  activityConsole.append(mergeMsg, mergeOptions);
};
