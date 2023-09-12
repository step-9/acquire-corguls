const express = require("express");
const { authorize } = require("../middleware/auth");
const { authorizeLobbyMember } = require("../middleware/lobby");

const serveLobbyPage = (_, res) => {
  res.sendFile("lobby.html", { root: "pages" });
};

const doNotJoinIfGameHasStarted = (req, res, next) => {
  const lobby = req.context.lobby;

  if (lobby.status().hasGameStarted) {
    const error = "Game has already started!";
    res.status(401).json({ error });
    return;
  }

  next();
};

const joinPlayer = (req, res) => {
  const lobby = req.context.lobby;
  const { username } = req.body;

  lobby.addPlayer({ username });

  if (lobby.isFull()) {
    const game = {};
    lobby.startGame(game);
  }

  res.cookie("username", username).redirect("/lobby");
};

const sendLobbyStatus = (req, res) => {
  const { lobby } = req.context;
  res.json(lobby.status());
};

const createLobbyRouter = context => {
  const router = new express.Router();

  router.use((req, _res, next) => {
    req.context = context;
    next();
  });

  router.post("/players", doNotJoinIfGameHasStarted, joinPlayer);
  router.get("/", authorize, serveLobbyPage);
  router.get("/status", authorizeLobbyMember, sendLobbyStatus);

  return router;
};

module.exports = { createLobbyRouter };
