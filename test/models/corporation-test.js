const assert = require("assert");
const { it, describe } = require("node:test");
const { Corporation } = require("../../src/models/corporation");

describe("Corporation", () => {
  describe("establish", () => {
    it("should mark a corporation as active", () => {
      const phoenix = new Corporation();

      assert.ok(!phoenix.isActive);
      phoenix.establish();
      assert.ok(phoenix.isActive);
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
