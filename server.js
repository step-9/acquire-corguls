const { createApp } = require("./src/app");
const { Player } = require("./src/models/player");
const Lobby = require("./src/models/lobby");
const { createGameRouter } = require("./src/routers/game-router");
const { createLobbyRouter } = require("./src/routers/lobby-router");

const PORT = process.env.PORT || 8080;

const logServerInfo = () => {
  console.log("Listening on", PORT);
  console.log("Local:", `http://localhost:${PORT}`);
};

const initializeAccountStocks = () => {
  return {
    "phoenix": 10,
    "quantum": 0,
    "hydra": 0,
    "fusion": 8,
    "america": 0,
    "sackson": 0,
    "zeta": 0,
  };
};

const setUpPlayerAccount = () => {
  const stocks = initializeAccountStocks();
  const tiles = ["2A", "3B", "4C"];
  const initialBalance = 0;
  const name = "Bittu";
  return new Player(name, initialBalance, stocks, tiles);
};

const setUpLobby = () => {
  const maxPlayers = 3;
  return new Lobby(maxPlayers);
};

const main = () => {
  const lobby = setUpLobby();
  const player = setUpPlayerAccount();

  const lobbyRouter = createLobbyRouter({ lobby });
  const gameRouter = createGameRouter({ player });

  const app = createApp(lobbyRouter, gameRouter);
  app.listen(PORT, logServerInfo);
};

main();
