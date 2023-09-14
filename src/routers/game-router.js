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

const createGameRouter = () => {
  const router = new express.Router();

  router.get("/", authorizeLobbyMember, serveGamePage);
  router.get("/status", authorizeLobbyMember, serveGameStats);

  return router;
};

module.exports = {
  createGameRouter,
};
