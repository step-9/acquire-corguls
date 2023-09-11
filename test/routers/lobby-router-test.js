const assert = require("assert");
const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");

describe("GET /lobby", () => {
  it("should serve the lobby page", (_, done) => {
    const lobby = new Set();
    const lobbyRouter = createLobbyRouter({ lobby });
    const app = createApp(lobbyRouter);
    request(app)
      .get("/lobby")
      .expect(200)
      .expect("content-type", new RegExp("text/html"))
      .end(done);
  });
});

describe("POST /players", () => {
  it("should add the player in the lobby", (_, done) => {
    const lobby = new Set();
    const lobbyRouter = createLobbyRouter({ lobby });
    const app = createApp(lobbyRouter);

    const username = "player";
    request(app)
      .post("/players")
      .send({ username })
      .expect(302)
      .expect("location", "/lobby")
      .end(err => {
        assert.deepStrictEqual([...lobby], [username]);
        done(err);
      });
  });
});

describe("GET /players", () => {
  it("should get the players in the lobby", (_, done) => {
    const lobby = new Set();
    const lobbyRouter = createLobbyRouter({ lobby });
    const app = createApp(lobbyRouter);

    const username = "player";
    lobby.add(username);

    request(app)
      .get("/players")
      .expect(200)
      .expect("content-type", new RegExp("application/json"))
      .expect([username])
      .end(done);
  });
});
