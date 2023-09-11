const getPlayerSection = () => document.querySelector("#players");

const getPlayers = () => {
  return fetch("/players").then(res => res.json());
};

const renderPlayer = (username, playerElement) => {
  const playerNameElement = playerElement.querySelector(".name");
  playerElement.classList.add("joined");
  playerNameElement.innerText = username;
};

const renderPlayers = players => {
  const playerSection = getPlayerSection();
  players.forEach((username, index) => {
    const playerElement = playerSection.children[index];
    renderPlayer(username, playerElement);
  });
};

const updateLobby = () => {
  getPlayers().then(renderPlayers);
};

const keepLobbyUpdated = () => {
  const interval = 1000;
  updateLobby();
  setInterval(updateLobby, interval);
};

const main = () => {
  keepLobbyUpdated();
};

window.onload = main;
