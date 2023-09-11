const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../src/app");
const { createLobbyRouter } = require("../src/routers/lobby-router");
const { createGameRouter } = require("../src/routers/game-router");

describe("App", () => {
  describe("GET /", () => {
    it("should serve the home page", (_, done) => {
      const lobby = new Set();
      const lobbyRouter = createLobbyRouter({ lobby });
      const gameRouter = createGameRouter({});
      const app = createApp(lobbyRouter, gameRouter);
      request(app)
        .get("/")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });
  });

  describe("GET /game", () => {
    it("should serve the game page", (_, done) => {
      const lobby = new Set();
      const lobbyRouter = createLobbyRouter({ lobby });
      const gameRouter = createGameRouter({});
      const app = createApp(lobbyRouter, gameRouter);
      request(app)
        .get("/game")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });
  });
});
