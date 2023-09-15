const express = require("express");
const { authorizeLobbyMember } = require("../middleware/lobby");

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

const createGameRouter = () => {
  const router = new express.Router();

  router.get("/", authorizeLobbyMember, serveGamePage);
  router.get("/status", authorizeLobbyMember, serveGameStats);
  router.post("/tile", authorizeLobbyMember, placeTile);
  router.post("/end-turn", authorizeLobbyMember, endPlayerTurn);

  return router;
};

module.exports = {
  createGameRouter,
};
