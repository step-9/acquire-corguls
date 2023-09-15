const assert = require("assert");
const { it, describe } = require("node:test");
const { Corporation } = require("../../src/models/corporation");
const { CORPORATION_TYPES } = require("../../src/constants");

describe("Corporation", () => {
  describe("establish", () => {
    it("should mark a corporation as active", () => {
      const phoenix = new Corporation();

      assert.ok(!phoenix.isActive);
      phoenix.establish();
      assert.ok(phoenix.isActive);
    });
  });

  describe("stats", () => {
    it("should give status of a corporation based on the tiles", () => {
      const phoenix = new Corporation(CORPORATION_TYPES.large);
      const stats = {
        stocks: 25,
        tiles: [],
        isActive: false,
        price: 0,
        majority: 2000,
        minority: 1000,
      };

      assert.deepStrictEqual(phoenix.stats(), stats);
    });

    it("price should be reasonable for tiles between 6-10", () => {
      const tiles = new Array(7).fill();
      const phoenix = new Corporation(CORPORATION_TYPES.large, tiles);
      const stats = {
        tiles,
        stocks: 25,
        isActive: false,
        price: 800,
        majority: 2000,
        minority: 1000,
      };

      assert.deepStrictEqual(phoenix.stats(), stats);
    });

    it("price should be reasonable for tiles between 11-20", () => {
      const tiles = new Array(12).fill();
      const phoenix = new Corporation(CORPORATION_TYPES.large, tiles);
      const stats = {
        tiles,
        stocks: 25,
        isActive: false,
        price: 900,
        majority: 2000,
        minority: 1000,
      };

      assert.deepStrictEqual(phoenix.stats(), stats);
    });

    it("price should be reasonable for tiles between 21-30", () => {
      const tiles = new Array(28).fill();
      const phoenix = new Corporation(CORPORATION_TYPES.large, tiles);
      const stats = {
        tiles,
        stocks: 25,
        isActive: false,
        price: 1000,
        majority: 2000,
        minority: 1000,
      };

      assert.deepStrictEqual(phoenix.stats(), stats);
    });

    it("price should be reasonable for tiles between 31-40", () => {
      const tiles = new Array(33).fill();
      const phoenix = new Corporation(CORPORATION_TYPES.large, tiles);
      const stats = {
        tiles,
        stocks: 25,
        isActive: false,
        price: 1100,
        majority: 2000,
        minority: 1000,
      };

      assert.deepStrictEqual(phoenix.stats(), stats);
    });

    it("price should be reasonable for tiles between 41+", () => {
      const tiles = new Array(53).fill();
      const phoenix = new Corporation(CORPORATION_TYPES.large, tiles);
      const stats = {
        tiles,
        stocks: 25,
        isActive: false,
        price: 1200,
        majority: 2000,
        minority: 1000,
      };

      assert.deepStrictEqual(phoenix.stats(), stats);
    });
  });

  describe("decrementStock", () => {
    it("should decrease the stocks quantity", () => {
      const phoenix = new Corporation();

      phoenix.establish();

      assert.strictEqual(phoenix.stocks, 25);
      phoenix.decrementStocks(1);
      assert.strictEqual(phoenix.stocks, 24);
    });

    it("should not decrease the stocks quantity if corporation is not established", () => {
      const phoenix = new Corporation();

      phoenix.decrementStocks(2);
      assert.strictEqual(phoenix.stocks, 25);
    });
  });
});
