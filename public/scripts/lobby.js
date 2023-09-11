const getPlayerSection = () => document.querySelector("#players");

const getPlayers = () => {
  return fetch("/players").then(res => res.json());
};

const renderPlayer = username => {
  const playerElement = document.createElement("li");

  playerElement.innerText = username;
  playerElement.classList.add("player");

  return playerElement;
};

const renderPlayers = players => {
  const playerSection = getPlayerSection();
  const playerElements = players.map(renderPlayer);
  playerSection.append(...playerElements);
};

const main = () => {
  getPlayers().then(renderPlayers);
};

window.onload = main;
