const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../src/app");
const { createLobbyRouter } = require("../src/routers/lobby-router");

describe("App", () => {
  describe("GET /", () => {
    it("should serve the home page", (_, done) => {
      const lobby = new Set();
      const lobbyRouter = createLobbyRouter({ lobby });
      const app = createApp(lobbyRouter);
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
      const app = createApp(lobbyRouter);
      request(app)
        .get("/game")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });
  });
});
