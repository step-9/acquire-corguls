const express = require("express");
const { authorizeLobbyMember } = require("../middleware/lobby");
const { Game, loadGame } = require("../models/game");
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

const buyStocks = (req, res) => {
  const { game } = req.app.context;
  const { name, quantity, price } = req.body;

  game.buyStocks({ name, quantity, price });
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

const configureGame = (req, res) => {
  const gameData = req.body;
  const game = loadGame(gameData);
  req.app.context.game = game;
  res.status(201).end();
};

const endMerge = (req, res) => {
  const { game } = req.app.context;
  game.endMerge();
  res.status(200).end();
};

const createGameRouter = () => {
  const router = new express.Router();

  router.post("/test", configureGame);
  router.use(authorizeLobbyMember);
  router.get("/", verifyStart, serveGamePage);
  router.post("/start", verifyHost, verifyStart, startGame);
  router.get("/status", serveGameStats);
  router.post("/tile", placeTile);
  router.post("/end-turn", endPlayerTurn);
  router.post("/buy-stocks", buyStocks);
  router.post("/establish", establishCorporation);
  router.post("/end-merge", endMerge);

  return router;
};

module.exports = {
  createGameRouter,
};
