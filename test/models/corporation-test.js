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
});
