const assert = require("assert");
const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
const { createGameRouter } = require("../../src/routers/game-router");
const Lobby = require("../../src/models/lobby");

describe("GET /lobby", () => {
  it("should serve the lobby page", (_, done) => {
    const lobby = new Lobby(3);
    const lobbyRouter = createLobbyRouter({ lobby });
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter);
    request(app)
      .get("/lobby")
      .expect(200)
      .expect("content-type", new RegExp("text/html"))
      .end(done);
  });
});

describe("POST /lobby/players", () => {
  it("should add the player in the lobby", (_, done) => {
    const size = 3;
    const lobby = new Lobby(size);
    const lobbyRouter = createLobbyRouter({ lobby });
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter);

    const username = "player";
    request(app)
      .post("/lobby/players")
      .send({ username })
      .expect(302)
      .expect("location", "/lobby")
      .end(err => {
        assert.deepStrictEqual(lobby.status().players, [{ username }]);
        done(err);
      });
  });

  it("should start the game if room is full", (_, done) => {
    const size = 3;
    const lobby = new Lobby(size);
    const lobbyRouter = createLobbyRouter({ lobby });
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter);

    lobby.addPlayer({ username: "player1" });
    lobby.addPlayer({ username: "player2" });

    const username = "player";
    request(app)
      .post("/lobby/players")
      .send({ username })
      .expect(302)
      .expect("location", "/lobby")
      .end(err => {
        assert.ok(lobby.status().hasGameStarted);
        done(err);
      });
  });
});

describe("GET /lobby/status", () => {
  it("should get the latest status of the lobby", (_, done) => {
    const lobby = new Lobby(3);
    const lobbyRouter = createLobbyRouter({ lobby });
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter);

    const expectedStatus = {
      players: [],
      isFull: false,
      hasGameStarted: false,
    };

    request(app)
      .get("/lobby/status")
      .expect(200)
      .expect("content-type", new RegExp("application/json"))
      .expect(expectedStatus)
      .end(done);
  });
});
