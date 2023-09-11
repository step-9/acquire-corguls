const { it, describe } = require("node:test");
const assert = require("assert");
const { Account } = require("../../src/models/account");

describe("Account", () => {
  describe("stats", () => {
    it("should have an initial amount of 0", () => {
      const account = new Account();
      const { balance } = account.stats();

      assert.strictEqual(balance, 0);
    });

    it("shouldn't have any tiles initially", () => {
      const account = new Account();
      const { tiles } = account.stats();

      assert.strictEqual(tiles.length, 0);
    });

    it("shouldn't have any stocks initially", () => {
      const account = new Account();
      const { stocks } = account.stats();

      assert.deepStrictEqual({}, stocks);
    });

    it("should have zero stocks of each corporation initially", () => {
      const account = new Account(0, { phoenix: 0, hydra: 0 });
      const { stocks } = account.stats();
      assert.deepStrictEqual({ phoenix: 0, hydra: 0 }, stocks);
    });

    it("should include an overall account statistic", () => {
      const account = new Account();

      assert.deepStrictEqual(account.stats(), {
        balance: 0,
        tiles: [],
        stocks: {},
      });
    });
  });

  describe("credit", () => {
    it("should add the specified amount to the account balance", () => {
      const account = new Account();
      account.credit(6000);
      const { balance } = account.stats();

      assert.strictEqual(balance, 6000);
    });
  });

  describe("debit", () => {
    it("should add the specified amount to the account balance", () => {
      const account = new Account();
      account.credit(10000);
      account.debit(6000);
      const { balance } = account.stats();

      assert.strictEqual(balance, 4000);
    });
  });

  describe("addTile", () => {
    it("should add specified tile in the tile collection", () => {
      const account = new Account();
      account.addTile("2A");
      const { tiles } = account.stats();

      assert.deepStrictEqual(tiles, ["2A"]);
    });
  });

  describe("removeTile", () => {
    it("should remove a specified tile from the tile collection", () => {
      const account = new Account();
      account.addTile("2A");
      account.addTile("9I");
      account.removeTile("2A");
      const { tiles } = account.stats();

      assert.deepStrictEqual(tiles, ["9I"]);
    });
  });
});
