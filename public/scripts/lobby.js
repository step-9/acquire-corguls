const getPlayerSection = () => document.querySelector("#players");
const getMessageElement = () => document.querySelector("#message");
const getAnimationSection = () => document.querySelector("#animation");

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

  messageElement.innerText = "Loading Game";
  const interval = setInterval(() => {
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

const animate = () => {
  const animationSection = getAnimationSection();
  let dots = 0;
  setInterval(() => {
    animationSection.innerText = ".".repeat(dots);
    dots = (dots % 3) + 1;
  }, 500);
};

const main = () => {
  animate();
  keepLobbyUpdated();
};

window.onload = main;
