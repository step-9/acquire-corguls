const { shuffle } = require("lodash");
const Lobby = require("./src/models/lobby");
const { createApp } = require("./src/app");
const { createGameRouter } = require("./src/routers/game-router");
const { createLobbyRouter } = require("./src/routers/lobby-router");

const PORT = process.env.PORT || 8080;

const logServerInfo = () => {
  console.log("Listening on", PORT);
  console.log("Local:", `http://localhost:${PORT}`);
};

const setUpLobby = () => {
  const maxPlayers = 1;
  return new Lobby(maxPlayers);
};

const main = () => {
  const lobby = setUpLobby();
  const lobbyRouter = createLobbyRouter();
  const gameRouter = createGameRouter();

  const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });
  app.listen(PORT, logServerInfo);
};

main();
