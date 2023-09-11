const { createApp } = require("./src/app");

const PORT = process.env.PORT || 8080;

const logServerInfo = () => {
  console.log("Listening on", PORT);
  console.log("Local:", `http://localhost:${PORT}`);
};

const main = () => {
  const app = createApp();
  app.listen(PORT, logServerInfo);
};

main();
