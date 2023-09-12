const { it, describe } = require("node:test");
const assert = require("assert");
const { Player } = require("../../src/models/player");

describe("Player", () => {
  describe("profile", () => {
    it("should have an initial amount of 0", () => {
      const player = new Player("Bittu");
      const { balance } = player.profile();

      assert.strictEqual(balance, 0);
    });

    it("shouldn't have any tiles initially", () => {
      const player = new Player("Bittu");
      const { tiles } = player.profile();

      assert.strictEqual(tiles.length, 0);
    });

    it("shouldn't have any stocks initially", () => {
      const account = new Player("Bittu");
      const { stocks } = account.profile();

      assert.deepStrictEqual({}, stocks);
    });

    it("should have zero stocks of each corporation initially", () => {
      const account = new Player("Biswa", 0, { phoenix: 0, hydra: 0 });
      const { stocks } = account.profile();
      assert.deepStrictEqual({ phoenix: 0, hydra: 0 }, stocks);
    });

    it("should include an overall account statistic", () => {
      const player = new Player("Bittu");

      assert.deepStrictEqual(player.profile(), {
        username: "Bittu",
        balance: 0,
        tiles: [],
        stocks: {},
      });
    });
  });

  describe("addIncome", () => {
    it("should add the specified amount to the player's account balance", () => {
      const account = new Player("Bittu");
      account.addIncome(6000);
      const { balance } = account.profile();

      assert.strictEqual(balance, 6000);
    });
  });

  describe("addExpense", () => {
    it("should deduct the specified amount from the player's account balance", () => {
      const player = new Player("Bittu");
      player.addIncome(10000);
      player.addExpense(6000);
      const { balance } = player.profile();

      assert.strictEqual(balance, 4000);
    });
  });

  describe("addTile", () => {
    it("should add specified tile in the tile collection", () => {
      const account = new Player("Bittu");
      account.addTile("2A");
      const { tiles } = account.profile();

      assert.deepStrictEqual(tiles, ["2A"]);
    });
  });

  describe("removeTile", () => {
    it("should remove a specified tile from the tile collection", () => {
      const account = new Player("Bittu");
      account.addTile("2A");
      account.addTile("9I");
      account.removeTile("2A");
      const { tiles } = account.profile();

      assert.deepStrictEqual(tiles, ["9I"]);
    });
  });
});
