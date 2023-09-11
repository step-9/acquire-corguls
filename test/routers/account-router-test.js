const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../../src/app");
const { createLobbyRouter } = require("../../src/routers/lobby-router");
const { Account } = require("../../src/models/account");
const { createGameRouter } = require("../../src/routers/game-router");

describe("GET /account-stats", () => {
  it("should get the players account details", (_, done) => {
    const account = new Account();
    const lobbyRouter = createLobbyRouter({});
    const accountRouter = createGameRouter({ account });
    const app = createApp(lobbyRouter, accountRouter);

    request(app)
      .get("/account-stats")
      .expect(200)
      .expect("content-type", new RegExp("application/json"))
      .expect({ tiles: [], stocks: {}, balance: 0 })
      .end(done);
  });
});
