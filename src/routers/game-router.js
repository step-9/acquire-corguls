const express = require("express");

const servePlayerProfile = (req, res) => {
  const { player } = req.context;
  res.send(player.profile());
};

const createGameRouter = context => {
  const router = new express.Router();

  router.use((req, _res, next) => {
    req.context = context;
    next();
  });

  router.get("/player-profile", servePlayerProfile);

  return router;
};

module.exports = {
  createGameRouter,
};
