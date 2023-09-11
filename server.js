const { createApp } = require("./src/app");
const { createLobbyRouter } = require("./src/routers/lobby-router");

const PORT = process.env.PORT || 8080;

const logServerInfo = () => {
  console.log("Listening on", PORT);
  console.log("Local:", `http://localhost:${PORT}`);
};

const main = () => {
  const lobby = new Set();
  const lobbyRouter = createLobbyRouter({ lobby });
  const app = createApp(lobbyRouter);

  app.listen(PORT, logServerInfo);
};

main();
