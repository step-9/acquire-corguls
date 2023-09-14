const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
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

  describe("GET /game/status", () => {
    it("should get the players account details", (_, done) => {
      const lobby = new Lobby(1);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;

      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });
      const portfolio = {
        tiles: [
          { tilePosition: { x: 0, y: 0 }, isPlaced: false },
          { tilePosition: { x: 0, y: 1 }, isPlaced: false },
          { tilePosition: { x: 0, y: 2 }, isPlaced: false },
          { tilePosition: { x: 0, y: 3 }, isPlaced: false },
          { tilePosition: { x: 0, y: 4 }, isPlaced: false },
          { tilePosition: { x: 0, y: 5 }, isPlaced: false },
        ],
        stocks: {
          phoenix: 0,
          quantum: 0,
          hydra: 0,
          fusion: 0,
          america: 0,
          sackson: 0,
          zeta: 0,
        },
        balance: 6000,
      };
      const gameStatus = {
        tiles: { incorporatedTiles: [] },
        players: [{ username, isTakingTurn: true, you: true }],
        portfolio,
      };

      request(app)
        .post("/lobby/players")
        .send({ username })
        .end(() => {
          request(app)
            .get("/game/status")
            .set("cookie", "username=player")
            .expect(200)
            .expect("content-type", new RegExp("application/json"))
            .expect(gameStatus)
            .end(done);
        });
    });
  });

  describe("POST /game/tile", () => {
    it("should place a tile on the board, in the specified position", (_, done) => {
      const lobby = new Lobby(1);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const userDetails = {
        tiles: {
          incorporatedTiles: [{ x: 0, y: 0 }],
        },
        players: [{ username, isTakingTurn: true, you: true }],
        portfolio: {
          tiles: [
            { tilePosition: { x: 0, y: 0 }, isPlaced: true },
            { tilePosition: { x: 0, y: 1 }, isPlaced: false },
            { tilePosition: { x: 0, y: 2 }, isPlaced: false },
            { tilePosition: { x: 0, y: 3 }, isPlaced: false },
            { tilePosition: { x: 0, y: 4 }, isPlaced: false },
            { tilePosition: { x: 0, y: 5 }, isPlaced: false },
          ],
          stocks: {
            phoenix: 0,
            quantum: 0,
            hydra: 0,
            fusion: 0,
            america: 0,
            sackson: 0,
            zeta: 0,
          },
          balance: 6000,
        },
      };

      request(app)
        .post("/lobby/players")
        .send({ username })
        .expect(200)
        .end(() => {
          request(app)
            .post("/game/tile")
            .set("cookie", "username=player")
            .send({ x: 0, y: 0 })
            .expect(200)
            .end(() => {
              request(app)
                .get("/game/status")
                .set("cookie", "username=player")
                .expect(200)
                .expect("content-type", new RegExp("application/json"))
                .expect(userDetails)
                .end(done);
            });
        });
    });
  });
});
