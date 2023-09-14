const { it, describe } = require("node:test");
const assert = require("assert");
const { Player } = require("../../src/models/player");
const { Game } = require("../../src/models/game");

describe("Game", () => {
  // TODO: extract constants
  describe("start", () => {
    it("should distribute initial assets to players", () => {
      const player1 = new Player("Biswa");
      const player2 = new Player("Bittu");
      const shuffle = x => x;

      const game = new Game([player1, player2], shuffle);
      game.start();

      assert.deepStrictEqual(player1.stats(), {
        username: "Biswa",
        tiles: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: 0, y: 3 },
          { x: 0, y: 4 },
          { x: 0, y: 5 },
        ],
        stocks: {},
        balance: 6000,
        isTakingTurn: false,
      });

      assert.deepStrictEqual(player2.stats(), {
        username: "Bittu",
        tiles: [
          { x: 0, y: 6 },
          { x: 0, y: 7 },
          { x: 0, y: 8 },
          { x: 0, y: 9 },
          { x: 0, y: 10 },
          { x: 0, y: 11 },
        ],
        stocks: {},
        balance: 6000,
        isTakingTurn: false,
      });
    });
  });

  describe("playerDetails", () => {
    it("should response with player stats", () => {
      const player1 = new Player("Biswa");
      const player2 = new Player("Bittu");
      const shuffle = x => x;

      const game = new Game([player1, player2], shuffle);
      game.start();
      assert.deepStrictEqual(game.playerDetails("Biswa"), {
        username: "Biswa",
        tiles: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: 0, y: 3 },
          { x: 0, y: 4 },
          { x: 0, y: 5 },
        ],
        stocks: {},
        balance: 6000,
        isTakingTurn: false,
      });
    });
  });

  describe("status", () => {
    it("should response with current game status", () => {
      const player1 = new Player("Biswa");
      const player2 = new Player("Bittu");
      const shuffle = x => x;

      const game = new Game([player1, player2], shuffle);
      game.start();

      const { players, portfolio } = game.status(player1.username);

      assert.deepStrictEqual(players, [
        { username: player1.username, isTakingTurn: false },
        { username: player2.username, isTakingTurn: false },
      ]);

      assert.deepStrictEqual(portfolio, player1.stats());
      assert.notDeepStrictEqual(portfolio, player2.stats());
    });
  });
});
