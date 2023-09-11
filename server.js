const { createApp } = require("./src/app");
const { Account } = require("./src/models/account");
const { createGameRouter } = require("./src/routers/game-router");
const { createLobbyRouter } = require("./src/routers/lobby-router");

const PORT = process.env.PORT || 8080;

const logServerInfo = () => {
  console.log("Listening on", PORT);
  console.log("Local:", `http://localhost:${PORT}`);
};

const main = () => {
  const lobby = new Set();
  const account = new Account();
  const lobbyRouter = createLobbyRouter({ lobby });
  const gameRouter = createGameRouter({ account });
  const app = createApp(lobbyRouter, gameRouter);

  app.listen(PORT, logServerInfo);
};

main();
