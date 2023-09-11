const express = require("express");
const { logRequest } = require("./middleware/logger");

const serveHomePage = (_, res) => {
  res.sendFile("index.html", { root: "pages" });
};

const serveGamePage = (_, res) => {
  res.sendFile("game.html", { root: "pages" });
};

const serveLobbyPage = (_, res) => {
  res.sendFile("lobby.html", { root: "pages" });
};

const createApp = () => {
  const app = express();

  app.use(logRequest);
  app.get("/", serveHomePage);
  app.get("/game", serveGamePage);
  app.get("/lobby", serveLobbyPage);
  app.use(express.static("public"));

  return app;
};

module.exports = { createApp };
