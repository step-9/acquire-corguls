const { createApp } = require("./src/app");
const { Account } = require("./src/models/account");
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
    "fusion": 0,
    "america": 0,
    "sackson": 0,
    "zeta": 0,
  };
};

const setUpAccount = () => {
  const stocks = initializeAccountStocks();
  const tiles = ["2A"];
  const initialBalance = 0;
  return new Account(initialBalance, stocks, tiles);
};

const setUpLobby = () => {
  const maxPlayers = 3;
  return new Lobby(maxPlayers);
};

const main = () => {
  const lobby = setUpLobby();
  const account = setUpAccount();

  const lobbyRouter = createLobbyRouter({ lobby });
  const gameRouter = createGameRouter({ account });

  const app = createApp(lobbyRouter, gameRouter);
  app.listen(PORT, logServerInfo);
};

main();
