const express = require("express");

const serveLobbyPage = (_, res) => {
  res.sendFile("lobby.html", { root: "pages" });
};

const joinPlayer = (req, res) => {
  const { username } = req.body;
  const lobby = req.context.lobby;
  lobby.addPlayer({ username });

  res.redirect("/lobby");
};

const sendLobbyStatus = (req, res) => {
  const lobby = req.context.lobby;
  res.json(lobby.status());
};

const createLobbyRouter = context => {
  const router = new express.Router();

  router.use((req, _res, next) => {
    req.context = context;
    next();
  });

  router.get("/", serveLobbyPage);
  router.post("/players", joinPlayer);
  router.get("/status", sendLobbyStatus);

  return router;
};

module.exports = { createLobbyRouter };
