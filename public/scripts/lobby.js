const getPlayerSection = () => document.querySelector("#players");

const getPlayers = () => {
  return fetch("/players").then(res => res.json());
};

const renderPlayer = (username, playerElement) => {
  const playerNameContainer = playerElement.querySelector(".name");
  const playerNameElement = document.createElement("p");

  playerElement.classList.add("joined");
  playerNameElement.innerText = username;
  playerNameContainer.append(playerNameElement);
};

const renderPlayers = players => {
  const playerSection = getPlayerSection();
  players.forEach((username, index) => {
    const playerElement = playerSection.children[index];
    renderPlayer(username, playerElement);
  });
};

const main = () => {
  getPlayers().then(renderPlayers);
};

window.onload = main;
