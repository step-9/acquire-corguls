const { it, describe } = require("node:test");
const assert = require("assert");
const { Player } = require("../../src/models/player");
const { Game } = require("../../src/models/game");

describe("Game", () => {
  describe("start", () => {
    it("should distribute initial assets to players", () => {
      const player1 = new Player("Biswa");
      const player2 = new Player("Bittu");

      const game = new Game([player1, player2]);
      game.start();

      assert.deepStrictEqual(player1.profile(), {
        username: "Biswa",
        tiles: ["3A", "2A", "6A", "4B", "9A", "12I"],
        stocks: {},
        balance: 6000,
      });

      assert.deepStrictEqual(player2.profile(), {
        username: "Bittu",
        tiles: ["3A", "2A", "6A", "4B", "9A", "12I"],
        stocks: {},
        balance: 6000,
      });
    });

    describe("playerDetails", () => {
      it("should response with player profile", () => {
        const player1 = new Player("Biswa");
        const player2 = new Player("Bittu");

        const game = new Game([player1, player2]);
        game.start();
        assert.deepStrictEqual(game.playerDetails("Biswa"), {
          username: "Biswa",
          tiles: ["3A", "2A", "6A", "4B", "9A", "12I"],
          stocks: {},
          balance: 6000,
        });
      });
    });
  });
});
