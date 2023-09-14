const assert = require("assert");
const { it, describe } = require("node:test");
const { Player } = require("../../src/models/player");

describe("Player", () => {
  describe("stats", () => {
    it("should have an initial amount of 0", () => {
      const player = new Player("Bittu");
      const { balance } = player.stats();

      assert.strictEqual(balance, 0);
    });

    it("shouldn't have any tiles initially", () => {
      const player = new Player("Bittu");
      const { tiles } = player.stats();

      assert.strictEqual(tiles.length, 0);
    });

    it("shouldn't have any stocks initially", () => {
      const player = new Player("Bittu");
      const { stocks } = player.stats();

      assert.deepStrictEqual({}, stocks);
    });

    it("should have zero stocks of each corporation initially", () => {
      const player = new Player("Biswa", 0, { phoenix: 0, hydra: 0 });
      const { stocks } = player.stats();
      assert.deepStrictEqual({ phoenix: 0, hydra: 0 }, stocks);
    });

    it("should include an overall player statistic", () => {
      const player = new Player("Bittu");

      assert.deepStrictEqual(player.stats(), {
        username: "Bittu",
        balance: 0,
        tiles: [],
        stocks: {},
        isTakingTurn: false
      });
    });
  });

  describe("addIncome", () => {
    it("should add the specified amount to the player's player balance", () => {
      const player = new Player("Bittu");
      player.addIncome(6000);
      const { balance } = player.stats();

      assert.strictEqual(balance, 6000);
    });
  });

  describe("addExpense", () => {
    it("should deduct the specified amount from the player's player balance", () => {
      const player = new Player("Bittu");
      player.addIncome(10000);
      player.addExpense(6000);
      const { balance } = player.stats();

      assert.strictEqual(balance, 4000);
    });
  });

  describe("addTile", () => {
    it("should add specified tile in the tile collection", () => {
      const player = new Player("Bittu");
      player.addTile("2A");
      const { tiles } = player.stats();

      assert.deepStrictEqual(tiles, ["2A"]);
    });
  });

  describe("removeTile", () => {
    it("should remove a specified tile from the tile collection", () => {
      const player = new Player("Bittu");
      player.addTile("2A");
      player.addTile("9I");
      player.removeTile("2A");
      const { tiles } = player.stats();

      assert.deepStrictEqual(tiles, []);
    });
  });

  describe("startTurn", () => {
    it("should start player's turn", () => {
      const player = new Player("Bittu");
      player.startTurn();

      const { isTakingTurn } = player.stats();
      assert.ok(isTakingTurn);
    });

    it("should not take turn if not started", () => {
      const player = new Player("Bittu");
      const { isTakingTurn } = player.stats();
      assert.ok(!isTakingTurn);
    });
  });

  describe("endTurn", () => {
    it("should end player's turn", () => {
      const player = new Player("Bittu");
      player.startTurn();
      player.endTurn();

      const { isTakingTurn } = player.stats();
      assert.ok(!isTakingTurn);
    });
  });
});
