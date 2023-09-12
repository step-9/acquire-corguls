const getPlayerSection = () => document.querySelector("#players");
const getMessageElement = () => document.querySelector("#message");

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

const redirectToGame = () => {
  const messageElement = getMessageElement();
  let delay = 3;

  const interval = setInterval(() => {
    messageElement.innerText = `Game starts in ${delay}...`;
    delay--;

    if (delay === 0) {
      window.location.assign("/game");
      clearInterval(interval);
      return;
    }
  }, 1000);
};

const updateLobby = () => {
  getLobbyStatus().then(status => {
    renderPlayers(status.players);
    if (status.hasGameStarted) redirectToGame();
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
