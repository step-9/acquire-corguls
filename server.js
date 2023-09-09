const express = require("express");
const PORT = process.env.PORT || 8080;

const serveHomePage = (_, res) => {
  res.sendFile("index.html", { root: "pages" });
};

const logServerInfo = () => {
  console.log("Listening on", PORT);
  console.log("Local:", `http://localhost:${PORT}`);
};

const main = () => {
  const app = express();

  app.get("/", serveHomePage);
  app.use(express.static("public"));

  app.listen(PORT, logServerInfo);
};

main();
