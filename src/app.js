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

const joinPlayer = (req, res) => {
  const { username } = req.body;
  const lobby = req.app.lobby;
  lobby.add(username);

  res.redirect("/lobby");
};

const createApp = lobby => {
  const app = express();
  app.lobby = lobby;

  app.use(logRequest);
  app.use(express.json());
  app.get("/", serveHomePage);
  app.get("/game", serveGamePage);
  app.get("/lobby", serveLobbyPage);
  app.post("/players", joinPlayer);
  app.use(express.static("public"));

  return app;
};

module.exports = { createApp };
