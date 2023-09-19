const assert = require("assert");
const { describe, it } = require("node:test");
const request = require("supertest");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
const { createGameRouter } = require("../../src/routers/game-router");
const Lobby = require("../../src/models/lobby");

describe("GameRouter", () => {
  const corporations = {
    phoenix: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
    quantum: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
    fusion: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
    hydra: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
    america: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
    zeta: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
    sackson: {
      stocks: 25,
      size: 0,
      isActive: false,
      isSafe: false,
      price: 0,
      majority: 2000,
      minority: 1000,
    },
  };

  describe("GET /game", () => {
    it("should serve the game page", (_, done) => {
      const size = { lowerLimit: 1, upperLimit: 1 };
      const lobby = new Lobby(size);
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
      const size = { lowerLimit: 3, upperLimit: 3 };
      const lobby = new Lobby(size);
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const app = createApp(lobbyRouter, gameRouter, { lobby });
      request(app).get("/game").expect(302).expect("location", "/").end(done);
    });
  });

  describe("GET /game/status", () => {
    it("should get current game status", (_, done) => {
      const size = { lowerLimit: 1, upperLimit: 1 };
      const lobby = new Lobby(size);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;

      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });
      const portfolio = {
        tiles: [
          { position: { x: 0, y: 0 }, isPlaced: false },
          { position: { x: 0, y: 1 }, isPlaced: false },
          { position: { x: 0, y: 2 }, isPlaced: false },
          { position: { x: 0, y: 3 }, isPlaced: false },
          { position: { x: 0, y: 4 }, isPlaced: false },
          { position: { x: 0, y: 5 }, isPlaced: false },
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
        setupTiles: [["player", { position: { x: 0, y: 6 }, isPlaced: true }]],
        state: "place-tile",
        placedTiles: [
          {
            position: { x: 0, y: 6 },
            isPlaced: true,
            belongsTo: "incorporated",
          },
        ],
        players: [{ username, isTakingTurn: true, you: true }],
        portfolio,
        corporations,
      };

      request(app)
        .post("/lobby/players")
        .set("cookie", "username=player")
        .send({ username })
        .end(() => {
          request(app)
            .post("/game/start")
            .set("cookie", "username=player")
            .end(() => {
              request(app)
                .get("/game/status")
                .set("cookie", "username=player")
                .expect(200)
                .end((err, res) => {
                  assert.deepStrictEqual(res.body, gameStatus);
                  done(err);
                });
            });
        });
    });
  });

  describe("POST /game/tile", () => {
    it("should place a tile on the board, in the specified position", (_, done) => {
      const size = { lowerLimit: 1, upperLimit: 1 };
      const lobby = new Lobby(size);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const gameStatus = {
        state: "buy-stocks",
        setupTiles: [["player", { position: { x: 0, y: 6 }, isPlaced: true }]],
        placedTiles: [
          {
            position: { x: 0, y: 6 },
            isPlaced: true,
            belongsTo: "incorporated",
          },
          {
            position: { x: 0, y: 0 },
            isPlaced: true,
            belongsTo: "incorporated",
          },
        ],
        players: [{ username, isTakingTurn: true, you: true }],
        portfolio: {
          tiles: [
            { position: { x: 0, y: 0 }, isPlaced: true },
            { position: { x: 0, y: 1 }, isPlaced: false },
            { position: { x: 0, y: 2 }, isPlaced: false },
            { position: { x: 0, y: 3 }, isPlaced: false },
            { position: { x: 0, y: 4 }, isPlaced: false },
            { position: { x: 0, y: 5 }, isPlaced: false },
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
        corporations,
      };

      request(app)
        .post("/lobby/players")
        .send({ username })
        .expect(200)
        .end(() => {
          request(app)
            .post("/game/start")
            .set("cookie", "username=player")
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
                    .end((err, res) => {
                      assert.deepStrictEqual(res.body, gameStatus);
                      done(err);
                    });
                });
            });
        });
    });
  });

  describe("POST /game/end-turn", () => {
    it("should change the turn of a player", (_, done) => {
      const size = { lowerLimit: 2, upperLimit: 2 };
      const lobby = new Lobby(size);
      const username1 = "player1";
      const username2 = "player2";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const expectedPlayers = [
        { username: username1, isTakingTurn: false, you: true },
        { username: username2, isTakingTurn: true, you: false },
      ];

      request(app)
        .post("/lobby/players")
        .send({ username: username1 })
        .expect(200)
        .end(() => {
          request(app)
            .post("/lobby/players")
            .send({ username: username2 })
            .expect(200)
            .end(() => {
              request(app)
                .post("/game/start")
                .set("cookie", "username=player1")
                .expect(200)
                .end(() => {
                  request(app)
                    .post("/game/end-turn")
                    .set("cookie", "username=player1")
                    .expect(200)
                    .end(() => {
                      request(app)
                        .get("/game/status")
                        .set("cookie", "username=player1")
                        .expect(200)
                        .end((err, res) => {
                          const { players } = res.body;
                          assert.deepStrictEqual(players, expectedPlayers);
                          done(err);
                        });
                    });
                });
            });
        });
    });
  });

  describe("POST /game/start", () => {
    it("should start the game when has enough players", (_, done) => {
      const size = { lowerLimit: 1, upperLimit: 1 };
      const lobby = new Lobby(size);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      request(app)
        .post("/lobby/players")
        .send({ username })
        .expect(200)
        .end(() => {
          request(app)
            .post("/game/start")
            .set("cookie", "username=player")
            .expect(200)
            .end(err => {
              const { hasExpired } = lobby.status();
              assert.ok(hasExpired);
              done(err);
            });
        });
    });

    it("should redirect to the home page when not enough players has joined", (_, done) => {
      const size = { lowerLimit: 2, upperLimit: 2 };
      const lobby = new Lobby(size);
      const username = "player";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      request(app)
        .post("/lobby/players")
        .send({ username })
        .expect(200)
        .end(() => {
          request(app)
            .post("/game/start")
            .set("cookie", "username=player")
            .expect(302)
            .expect("location", "/lobby")
            .end(done);
        });
    });

    it("should start the game on host request", (_, done) => {
      const size = { lowerLimit: 2, upperLimit: 2 };
      const lobby = new Lobby(size);
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const username1 = "player1";
      const username2 = "player2";

      request(app)
        .post("/lobby/players")
        .send({ username: username1 })
        .expect(302)
        .expect("location", "/lobby")
        .end(() => {
          request(app)
            .post("/lobby/players")
            .send({ username: username2 })
            .expect(302)
            .expect("location", "/lobby")
            .end(() => {
              request(app)
                .post("/game/start")
                .set("cookie", "username=player1")
                .expect(200)
                .end(done);
            });
        });
    });

    it("should start the game only on host request", (_, done) => {
      const size = { lowerLimit: 2, upperLimit: 2 };
      const lobby = new Lobby(size);
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const username1 = "player1";
      const username2 = "player2";

      request(app)
        .post("/lobby/players")
        .send({ username: username1 })
        .expect(302)
        .expect("location", "/lobby")
        .end(() => {
          request(app)
            .post("/lobby/players")
            .send({ username: username2 })
            .expect(302)
            .expect("location", "/lobby")
            .end(() => {
              request(app)
                .post("/game/start")
                .set("cookie", "username=player2")
                .expect(400)
                .end(done);
            });
        });
    });
  });

  describe("POST /game/establish", () => {
    it("should establish selected corporation", (_, done) => {
      const size = { lowerLimit: 2, upperLimit: 2 };
      const lobby = new Lobby(size);
      const username1 = "player1";
      const username2 = "player2";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const portfolio = {
        tiles: [
          { position: { x: 0, y: 0 }, isPlaced: true },
          { position: { x: 0, y: 1 }, isPlaced: false },
          { position: { x: 0, y: 2 }, isPlaced: false },
          { position: { x: 0, y: 3 }, isPlaced: false },
          { position: { x: 0, y: 4 }, isPlaced: false },
          { position: { x: 0, y: 5 }, isPlaced: false },
        ],
        stocks: {
          phoenix: 1,
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
        setupTiles: [
          [
            "player1",
            {
              position: { x: 1, y: 0 },
              isPlaced: true,
            },
          ],
          [
            "player2",
            {
              position: { x: 1, y: 1 },
              isPlaced: true,
            },
          ],
        ],
        state: "buy-stocks",
        placedTiles: [
          {
            belongsTo: "phoenix",
            isPlaced: true,
            position: {
              x: 1,
              y: 0,
            },
          },
          {
            belongsTo: "phoenix",
            isPlaced: true,
            position: {
              x: 1,
              y: 1,
            },
          },
          {
            belongsTo: "phoenix",
            isPlaced: true,
            position: {
              x: 0,
              y: 0,
            },
          },
        ],

        players: [
          { username: username1, isTakingTurn: true, you: true },
          { username: username2, isTakingTurn: false, you: false },
        ],
        portfolio,
        corporations: {
          ...corporations,
          phoenix: {
            stocks: 24,
            size: 3,
            isActive: true,
            isSafe: false,
            price: 500,
            majority: 2000,
            minority: 1000,
          },
        },
      };

      request(app)
        .post("/lobby/players")
        .send({ username: username1 })
        .expect(200)
        .end(() => {
          request(app)
            .post("/lobby/players")
            .send({ username: username2 })
            .expect(200)
            .end(() => {
              request(app)
                .post("/game/start")
                .set("cookie", "username=player1")
                .expect(200)
                .end(() => {
                  request(app)
                    .post("/game/tile")
                    .set("cookie", "username=player1")
                    .send({ x: 0, y: 0 })
                    .expect(200)
                    .end(() => {
                      request(app)
                        .post("/game/establish")
                        .send({ name: "phoenix" })
                        .set("cookie", "username=player1")
                        .expect(200)
                        .end(() => {
                          request(app)
                            .get("/game/status")
                            .set("cookie", "username=player1")
                            .expect(200)
                            .end((err, res) => {
                              assert.deepStrictEqual(res.body, gameStatus);
                              done(err);
                            });
                        });
                    });
                });
            });
        });
    });
  });

  describe("POST /game/buy-stocks", () => {
    it("should buy stocks of an active corporation", (_, done) => {
      const size = { lowerLimit: 2, upperLimit: 2 };
      const lobby = new Lobby(size);
      const username1 = "player1";
      const username2 = "player2";
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const portfolio = {
        tiles: [
          { position: { x: 0, y: 0 }, isPlaced: true },
          { position: { x: 0, y: 1 }, isPlaced: false },
          { position: { x: 0, y: 2 }, isPlaced: false },
          { position: { x: 0, y: 3 }, isPlaced: false },
          { position: { x: 0, y: 4 }, isPlaced: false },
          { position: { x: 0, y: 5 }, isPlaced: false },
        ],
        stocks: {
          phoenix: 4,
          quantum: 0,
          hydra: 0,
          fusion: 0,
          america: 0,
          sackson: 0,
          zeta: 0,
        },
        balance: 5000,
      };

      const gameStatus = {
        setupTiles: [
          ["player1", { position: { x: 1, y: 0 }, isPlaced: true }],
          ["player2", { position: { x: 1, y: 1 }, isPlaced: true }],
        ],
        state: "tile-placed",
        placedTiles: [
          {
            belongsTo: "phoenix",
            isPlaced: true,
            position: {
              x: 1,
              y: 0,
            },
          },
          {
            belongsTo: "phoenix",
            isPlaced: true,
            position: {
              x: 1,
              y: 1,
            },
          },
          {
            belongsTo: "phoenix",
            isPlaced: true,
            position: {
              x: 0,
              y: 0,
            },
          },
        ],
        players: [
          { username: username1, isTakingTurn: true, you: true },
          { username: username2, isTakingTurn: false, you: false },
        ],
        portfolio,
        corporations: {
          ...corporations,
          phoenix: {
            stocks: 21,
            size: 3,
            isActive: true,
            isSafe: false,
            price: 500,
            majority: 2000,
            minority: 1000,
          },
        },
      };

      request(app)
        .post("/lobby/players")
        .send({ username: username1 })
        .expect(200)
        .end(() => {
          request(app)
            .post("/lobby/players")
            .send({ username: username2 })
            .expect(200)
            .end(() => {
              request(app)
                .post("/game/start")
                .set("cookie", "username=player1")
                .expect(200)
                .end(() => {
                  request(app)
                    .post("/game/tile")
                    .set("cookie", "username=player1")
                    .send({ x: 0, y: 0 })
                    .expect(200)
                    .end(() => {
                      request(app)
                        .post("/game/establish")
                        .send({ name: "phoenix" })
                        .set("cookie", "username=player1")
                        .expect(200)
                        .end(() => {
                          request(app)
                            .post("/game/buy-stocks")
                            .send({
                              name: "phoenix",
                              quantity: 3,
                              price: 1000,
                            })
                            .set("cookie", "username=player1")
                            .expect(200)
                            .end(() => {
                              request(app)
                                .get("/game/status")
                                .set("cookie", "username=player1")
                                .end((err, res) => {
                                  assert.deepStrictEqual(res.body, gameStatus);
                                  done(err);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
  });

  describe("POST /game/test", () => {
    it("should load a game from a state", (_, done) => {
      const size = { lowerLimit: 1, upperLimit: 2 };
      const lobby = new Lobby(size);
      const lobbyRouter = createLobbyRouter();
      const gameRouter = createGameRouter();
      const shuffle = x => x;
      const app = createApp(lobbyRouter, gameRouter, { lobby, shuffle });

      const expectedStatus = {
        "state": "place-tile",
        "setupTiles": [
          [
            "biswa",
            {
              "position": {
                "x": 1,
                "y": 6,
              },
              "isPlaced": true,
            },
          ],
        ],
        "players": [
          {
            "username": "biswa",
            "isTakingTurn": true,
            "you": true,
          },
        ],
        "portfolio": {
          "tiles": [
            {
              "position": {
                "x": 0,
                "y": 0,
              },
              "isPlaced": false,
            },
            {
              "position": {
                "x": 0,
                "y": 1,
              },
              "isPlaced": false,
            },
            {
              "position": {
                "x": 0,
                "y": 2,
              },
              "isPlaced": false,
            },
            {
              "position": {
                "x": 0,
                "y": 3,
              },
              "isPlaced": false,
            },
            {
              "position": {
                "x": 0,
                "y": 4,
              },
              "isPlaced": false,
            },
            {
              "position": {
                "x": 0,
                "y": 5,
              },
              "isPlaced": false,
            },
          ],
          "stocks": {
            "phoenix": 0,
            "quantum": 0,
            "hydra": 0,
            "fusion": 0,
            "america": 0,
            "sackson": 0,
            "zeta": 0,
          },
          "balance": 6000,
        },
        "placedTiles": [
          {
            "position": {
              "x": 0,
              "y": 6,
            },
            "isPlaced": true,
            "belongsTo": "incorporated",
          },
        ],
        corporations,
      };

      const gameState = {
        "setupTiles": [
          [
            { username: "biswa" },
            {
              "position": {
                "x": 1,
                "y": 6,
              },
              "isPlaced": true,
            },
          ],
        ],
        "players": [
          {
            "username": "biswa",
            "portfolio": {
              "tiles": [
                {
                  "position": {
                    "x": 0,
                    "y": 0,
                  },
                  "isPlaced": false,
                },
                {
                  "position": {
                    "x": 0,
                    "y": 1,
                  },
                  "isPlaced": false,
                },
                {
                  "position": {
                    "x": 0,
                    "y": 2,
                  },
                  "isPlaced": false,
                },
                {
                  "position": {
                    "x": 0,
                    "y": 3,
                  },
                  "isPlaced": false,
                },
                {
                  "position": {
                    "x": 0,
                    "y": 4,
                  },
                  "isPlaced": false,
                },
                {
                  "position": {
                    "x": 0,
                    "y": 5,
                  },
                  "isPlaced": false,
                },
              ],
              "stocks": {
                "phoenix": 0,
                "quantum": 0,
                "hydra": 0,
                "fusion": 0,
                "america": 0,
                "sackson": 0,
                "zeta": 0,
              },
              "balance": 6000,
            },
          },
        ],
        "placedTiles": [
          {
            "position": {
              "x": 0,
              "y": 6,
            },
            "isPlaced": true,
            "belongsTo": "incorporated",
          },
        ],
        corporations: {
          "phoenix": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 0,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
          "quantum": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 0,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
          "fusion": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 0,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
          "hydra": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 800,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
          "america": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 0,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
          "zeta": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 0,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
          "sackson": {
            "stocks": 25,
            "size": 0,
            "isActive": false,
            "price": 0,
            "majority": 2000,
            "minority": 1000,
            "isSafe": false,
          },
        },
      };

      request(app)
        .post("/lobby/players")
        .send({ username: "biswa" })
        .expect(200)
        .end(() => {
          request(app)
            .post("/game/start")
            .set("cookie", "username=biswa")
            .expect(200)
            .end(() => {
              request(app)
                .post("/game/test")
                .send(gameState)
                .expect(200)
                .end(() => {
                  request(app)
                    .get("/game/status")
                    .expect(200)
                    .set("cookie", "username=biswa")
                    .end((err, res) => {
                      assert.deepStrictEqual(res.body, expectedStatus);
                      done(err);
                    });
                });
            });
        });
    });
  });
});
