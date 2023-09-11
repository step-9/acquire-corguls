const express = require("express");

const serveAccountStats = (req, res) => {
  const { account } = req.context;
  res.send(account.stats());
};

const createGameRouter = context => {
  const router = new express.Router();

  router.use((req, _res, next) => {
    req.context = context;
    next();
  });

  router.get("/account-stats", serveAccountStats);

  return router;
};

module.exports = {
  createGameRouter,
};
