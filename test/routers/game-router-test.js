const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
const { Player } = require("../../src/models/player");
const { createGameRouter } = require("../../src/routers/game-router");
const Lobby = require("../../src/models/lobby");

describe("GameRouter", () => {
  describe("GET /game", () => {
    it("should serve the game page", (_, done) => {
      const lobby = new Lobby(3);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const app = createApp(lobbyRouter, gameRouter, { lobby });
      lobby.addPlayer({ username });

      request(app)
        .get("/game")
        .set("cookie", "username=player")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });

    it("should not allow if the player is not in game", (_, done) => {
      const lobby = new Lobby(3);
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const app = createApp(lobbyRouter, gameRouter, { lobby });
      request(app).get("/game").expect(302).expect("location", "/").end(done);
    });
  });

  describe("GET /game/player-profile", () => {
    it("should get the players account details", (_, done) => {
      const lobby = new Lobby(3);
      const username = "player";
      const player = new Player("Bittu");
      const lobbyRouter = createLobbyRouter();
      const accountRouter = createGameRouter();
      const app = createApp(lobbyRouter, accountRouter, { lobby, player });
      lobby.addPlayer({ username });

      request(app)
        .get("/game/player-profile")
        .set("cookie", "username=player")
        .expect(200)
        .expect("content-type", new RegExp("application/json"))
        .expect({ username: "Bittu", tiles: [], stocks: {}, balance: 0 })
        .end(done);
    });
  });
});
