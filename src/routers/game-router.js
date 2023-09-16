const express = require("express");
const { authorizeLobbyMember } = require("../middleware/lobby");
const { Game } = require("../models/game");
const { createCorporations } = require("../models/corporation");
const { createPlayers } = require("../models/player");

const serveGameStats = (req, res) => {
  const { game } = req.app.context;
  const { username } = req.cookies;
  res.send(game.status(username));
};

const serveGamePage = (_, res) => {
  res.sendFile("game.html", { root: "pages" });
};

const placeTile = (req, res) => {
  const { game } = req.app.context;
  const { username } = req.cookies;
  const tile = req.body;

  game.placeTile(username, tile);
  res.status(200).end();
};

const endPlayerTurn = (req, res) => {
  const { game } = req.app.context;
  game.changeTurn();
  res.end();
};

const establishCorporation = (req, res) => {
  const { game } = req.app.context;
  const { name } = req.body;

  game.establishCorporation({ name });
  res.end();
};

const verifyStart = (req, res, next) => {
  const { lobby } = req.app.context;
  const { isPossibleToStartGame } = lobby.status();

  if (!isPossibleToStartGame) {
    res.redirect("/lobby");
    return;
  }

  next();
};

const startGame = (req, res) => {
  const { lobby, shuffle } = req.app.context;
  const { players } = lobby.status();
  const corporations = createCorporations();

  const game = new Game(createPlayers(players), shuffle, corporations);

  req.app.context.game = game;
  game.start();
  lobby.expire();
  res.end();
};

const verifyHost = (req, res, next) => {
  const { username } = req.cookies;
  const { lobby } = req.app.context;
  const { self, host } = lobby.status(username);

  if (self.username !== host.username) {
    const error = "Invalid request !";
    return res.status(400).json({ error });
  }

  next();
};

const createGameRouter = () => {
  const router = new express.Router();

  router.get("/", authorizeLobbyMember, verifyStart, serveGamePage);
  router.post(
    "/start",
    authorizeLobbyMember,
    verifyHost,
    verifyStart,
    startGame
  );
  router.get("/status", authorizeLobbyMember, serveGameStats);
  router.post("/tile", authorizeLobbyMember, placeTile);
  router.post("/end-turn", authorizeLobbyMember, endPlayerTurn);
  router.post("/establish", authorizeLobbyMember, establishCorporation);

  return router;
};

module.exports = {
  createGameRouter,
};
