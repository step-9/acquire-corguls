const express = require("express");
const { logRequest } = require("./middleware/logger");

const serveHomePage = (_, res) => {
  res.sendFile("index.html", { root: "pages" });
};

const serveGamePage = (_, res) => {
  res.sendFile("game.html", { root: "pages" });
};

const createApp = lobbyRouter => {
  const app = express();

  app.use(logRequest);
  app.use(express.json());
  app.use(lobbyRouter);
  app.get("/", serveHomePage);
  app.get("/game", serveGamePage);
  app.use(express.static("public"));

  return app;
};

module.exports = { createApp };
