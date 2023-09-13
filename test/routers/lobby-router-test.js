const assert = require("assert");
const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
const { createGameRouter } = require("../../src/routers/game-router");
const Lobby = require("../../src/models/lobby");

describe("GET /lobby", () => {
  it("should not allow if player is not authorized", (_, done) => {
    const lobby = new Lobby(3);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter, { lobby });
    request(app).get("/lobby").expect(302).expect("location", "/").end(done);
  });

  it("should serve the lobby page", (_, done) => {
    const lobby = new Lobby(3);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter, { lobby });
    request(app)
      .get("/lobby")
      .set("cookie", "username=player")
      .expect(200)
      .expect("content-type", new RegExp("text/html"))
      .end(done);
  });
});

describe("POST /lobby/players", () => {
  it("should add the player in the lobby", (_, done) => {
    const size = 3;
    const lobby = new Lobby(size);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter, { lobby });

    const username = "player";
    request(app)
      .post("/lobby/players")
      .send({ username })
      .expect(302)
      .expect("location", "/lobby")
      .expect("set-cookie", new RegExp(`username=${username}`))
      .end(err => {
        assert.deepStrictEqual(lobby.status().players, [{ username }]);
        done(err);
      });
  });

  it("should start the game if room is full", (_, done) => {
    const size = 3;
    const username = "player3";
    const lobby = new Lobby(size);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter({});
    const shuffle = x => x;
    const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

    lobby.addPlayer({ username: "player1" });
    lobby.addPlayer({ username: "player2" });

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

  it("should not add player if the game has started", (_, done) => {
    const size = 3;
    const lobby = new Lobby(size);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter({});
    const app = createApp(lobbyRouter, gameRouter, { lobby });
    const players = [
      { username: "player1" },
      { username: "player2" },
      { username: "player3" },
    ];

    const player4 = { username: "player4" };

    lobby.addPlayer(players[0]);
    lobby.addPlayer(players[1]);

    request(app)
      .post("/lobby/players")
      .send(players[2])
      .end(() => {
        request(app)
          .post("/lobby/players")
          .send(player4)
          .expect(401)
          .expect({ error: "Game has already started!" })
          .end(err => {
            assert.deepStrictEqual(lobby.status().players, players);
            done(err);
          });
      });
  });
});

describe("GET /lobby/status", () => {
  it("should get the latest status of the lobby", (_, done) => {
    const lobby = new Lobby(3);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter();
    const app = createApp(lobbyRouter, gameRouter, { lobby });
    const player = { username: "player" };

    lobby.addPlayer(player);

    const expectedStatus = {
      players: [player],
      isFull: false,
      hasGameStarted: false,
    };

    request(app)
      .get("/lobby/status")
      .set("cookie", "username=player")
      .expect(200)
      .expect("content-type", new RegExp("application/json"))
      .expect(expectedStatus)
      .end(done);
  });

  it("should not allow if the player is not a member of the lobby", (_, done) => {
    const lobby = new Lobby(3);
    const lobbyRouter = createLobbyRouter();
    const gameRouter = createGameRouter();
    const app = createApp(lobbyRouter, gameRouter, { lobby });

    request(app)
      .get("/lobby/status")
      .set("cookie", "username=player")
      .expect(302)
      .expect("location", "/")
      .end(done);
  });
});
