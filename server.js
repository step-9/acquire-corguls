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
    "phoenix": 0,
    "quantum": 0,
    "hydra": 0,
    "fusion": 0,
    "america": 0,
    "sackson": 0,
    "zeta": 0,
  };
};

const main = () => {
  const maxPlayers = 3;
  const lobby = new Lobby(maxPlayers);
  const stocks = initializeAccountStocks();
  const initialBalance = 0;
  const account = new Account(initialBalance, stocks);
  const lobbyRouter = createLobbyRouter({ lobby });
  const gameRouter = createGameRouter({ account });
  const app = createApp(lobbyRouter, gameRouter);

  app.listen(PORT, logServerInfo);
};

main();
