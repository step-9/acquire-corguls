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
        tiles: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 0,
            y: 1,
          },
          {
            x: 0,
            y: 2,
          },
          {
            x: 0,
            y: 3,
          },
          {
            x: 0,
            y: 4,
          },
          {
            x: 0,
            y: 5,
          },
        ],
        stocks: {},
        balance: 6000,
      });

      assert.deepStrictEqual(player2.profile(), {
        username: "Bittu",
        tiles: [
          {
            x: 0,
            y: 6,
          },
          {
            x: 0,
            y: 7,
          },
          {
            x: 0,
            y: 8,
          },
          {
            x: 1,
            y: 0,
          },
          {
            x: 1,
            y: 1,
          },
          {
            x: 1,
            y: 2,
          },
        ],
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
          tiles: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 0,
              y: 1,
            },
            {
              x: 0,
              y: 2,
            },
            {
              x: 0,
              y: 3,
            },
            {
              x: 0,
              y: 4,
            },
            {
              x: 0,
              y: 5,
            },
          ],
          stocks: {},
          balance: 6000,
        });
      });
    });
  });
});
