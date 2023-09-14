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
  const tilePosition = req.body;
  game.placeTile(username, tilePosition);
  res.status(200).end();
};

const createGameRouter = () => {
  const router = new express.Router();

  router.get("/", authorizeLobbyMember, serveGamePage);
  router.get("/stats", authorizeLobbyMember, serveGameStats);
  router.post("/tile", authorizeLobbyMember, placeTile);

  return router;
};

module.exports = {
  createGameRouter,
};
