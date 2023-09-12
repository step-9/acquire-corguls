const express = require("express");
const { authorize } = require("../middleware/auth");
const { authorizeLobbyMember } = require("../middleware/lobby");
const { createPlayers } = require("../models/player");
const { Game } = require("../models/game");

const serveLobbyPage = (_, res) => {
  res.sendFile("lobby.html", { root: "pages" });
};

const doNotJoinIfGameHasStarted = (req, res, next) => {
  const lobby = req.app.context.lobby;

  if (lobby.status().hasGameStarted) {
    const error = "Game has already started!";
    res.status(401).json({ error });
    return;
  }

  next();
};

const joinPlayer = (req, res) => {
  const lobby = req.app.context.lobby;
  const { username } = req.body;

  lobby.addPlayer({ username });

  if (lobby.isFull()) {
    const { players } = lobby.status();
    const game = new Game(createPlayers(players));
    req.app.context.game = game;
    lobby.startGame(game);
  }

  res.cookie("username", username).redirect("/lobby");
};

const sendLobbyStatus = (req, res) => {
  const { lobby } = req.app.context;
  res.json(lobby.status());
};

const createLobbyRouter = () => {
  const router = new express.Router();

  router.get("/", authorize, serveLobbyPage);
  router.post("/players", doNotJoinIfGameHasStarted, joinPlayer);
  router.get("/status", authorizeLobbyMember, sendLobbyStatus);

  return router;
};

module.exports = { createLobbyRouter };
