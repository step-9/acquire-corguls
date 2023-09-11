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

const sendPlayers = (req, res) => {
  const lobby = req.context.lobby;
  res.json(lobby.status().players);
};

const createLobbyRouter = context => {
  const router = new express.Router();

  router.use((req, _res, next) => {
    req.context = context;
    next();
  });

  router.get("/lobby", serveLobbyPage);
  router.post("/players", joinPlayer);
  router.get("/players", sendPlayers);

  return router;
};

module.exports = { createLobbyRouter };
