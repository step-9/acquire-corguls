const getPlayerSection = () => document.querySelector("#players");

const getLobbyStatus = () => {
  return fetch("/lobby/status").then(res => res.json());
};

const renderPlayer = (username, playerElement) => {
  const playerNameElement = playerElement.querySelector(".name");
  playerElement.classList.add("joined");
  playerNameElement.innerText = username;
};

const renderPlayers = players => {
  const playerSection = getPlayerSection();
  players.forEach(({ username }, index) => {
    const playerElement = playerSection.children[index];
    renderPlayer(username, playerElement);
  });
};

const updateLobby = () => {
  getLobbyStatus().then(({ players }) => {
    renderPlayers(players);
  });
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
