const express = require("express");

const serveHomePage = (_, res) => {
  res.sendFile("index.html", { root: "pages" });
};

const createApp = () => {
  const app = express();

  app.get("/", serveHomePage);
  app.use(express.static("public"));

  return app;
};

module.exports = { createApp };
