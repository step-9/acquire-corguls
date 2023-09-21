const assert = require("assert");
const { describe, it } = require("node:test");
const Merger = require("../../src/models/merger");
const { createCorporations } = require("../../src/models/corporation");

describe("Merger", () => {
  describe("start", () => {
    it("should find the acquirer and defunct corporation", () => {
      const players = ["a", "b"];
      const connectedTiles = [
        { position: { x: 0, y: 0 }, isPlaced: true, belongsTo: "hydra" },
        { position: { x: 0, y: 1 }, isPlaced: true, belongsTo: "hydra" },
        { position: { x: 0, y: 2 }, isPlaced: true, belongsTo: "incorporated" },
        { position: { x: 0, y: 3 }, isPlaced: true, belongsTo: "zeta" },
        { position: { x: 0, y: 4 }, isPlaced: true, belongsTo: "zeta" },
        { position: { x: 0, y: 5 }, isPlaced: true, belongsTo: "zeta" },
      ];

      const merger = new Merger(players, createCorporations(), connectedTiles);
      merger.start();

      assert.strictEqual(merger.acquirer, "zeta");
      assert.strictEqual(merger.defunct, "hydra");
    });
  });

  describe("currentPlayer", () => {
    it("should give the current player", () => {
      const players = ["a", "b", "c", "d"];
      const merger = new Merger(players, createCorporations(), [], 2);

      assert.strictEqual(merger.currentPlayer(), "c");
    });

    it("should give next player, when turn's end", () => {
      const players = ["a", "b", "c", "d"];
      const merger = new Merger(players, createCorporations(), [], 2);
      merger.endTurn();

      assert.strictEqual(merger.currentPlayer(), "d");
    });
  });

  describe("hasEnd", () => {
    it("should give true, if all players have dealt with there defunt stocks", () => {
      const players = ["a", "b", "c"];
      const merger = new Merger(players, createCorporations(), [], 2);

      merger.endTurn();
      merger.endTurn();
      merger.endTurn();
      assert.ok(merger.hasEnd());
    });

    it("should give false, if all players haven't dealt with there defunt stocks", () => {
      const players = ["a", "b", "c"];
      const merger = new Merger(players, createCorporations(), [], 2);

      merger.endTurn();
      merger.endTurn();
      assert.ok(!merger.hasEnd());
    });
  });
});
