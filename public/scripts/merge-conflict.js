export const resolveMergeConflict = ({ turns }, activityConsole) => {
  const lastActivity = turns.currentTurn.activities.at(-1);
  console.log(lastActivity);
  const [mergingCorp1, mergingCorp2] = lastActivity.data;

  const selectionMsg = generateComponent(["div", "choose defunct corporation"]);
  const corp1 = generateComponent([
    "div",
    `${mergingCorp1}`,
    { class: "merger" },
  ]);

  const corp2 = generateComponent([
    "div",
    `${mergingCorp2}`,
    { class: "merger" },
  ]);

  activityConsole.innerHTML = "";
  activityConsole.append(selectionMsg, corp1, corp2);
};
