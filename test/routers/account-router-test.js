const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
const { Player } = require("../../src/models/player");
const { createGameRouter } = require("../../src/routers/game-router");

describe("GET /player-profile", () => {
  it("should get the players account details", (_, done) => {
    const player = new Player("Bittu");
    const lobbyRouter = createLobbyRouter({});
    const accountRouter = createGameRouter({ player });
    const app = createApp(lobbyRouter, accountRouter);

    request(app)
      .get("/player-profile")
      .expect(200)
      .expect("content-type", new RegExp("application/json"))
      .expect({ username: "Bittu", tiles: [], stocks: {}, balance: 0 })
      .end(done);
  });
});
