const assert = require("assert");
const { describe, it } = require("node:test");
const Lobby = require("../../src/models/lobby");

describe("Lobby", () => {
  describe("status", () => {
    it("should get the lobby status", () => {
      const size = 3;
      const lobby = new Lobby(size);
      const expectedStatus = {
        players: [],
        isFull: false,
        hasGameStarted: false,
      };

      assert.deepEqual(lobby.status(), expectedStatus);
    });
  });

  describe("addPlayer", () => {
    it("should add a player to the lobby", () => {
      const size = 3;
      const lobby = new Lobby(size);
      const username = "player";
      const player = { username };

      lobby.addPlayer(player);

      assert.deepStrictEqual(lobby.status().players, [player]);
    });
  });

  describe("isFull", () => {
    it("should not be full when lobby is empty", () => {
      const size = 3;
      const lobby = new Lobby(size);

      assert.ok(!lobby.isFull());
    });

    it("should not be full when less than 3 players are present", () => {
      const size = 3;
      const lobby = new Lobby(size);
      const username1 = "player1";
      const username2 = "player2";
      const player1 = { username: username1 };
      const player2 = { username: username2 };

      lobby.addPlayer(player1);
      lobby.addPlayer(player2);

      assert.ok(!lobby.isFull());
    });

    it("should be full if player count is same as lobby size", () => {
      const size = 2;
      const lobby = new Lobby(size);
      const username1 = "player1";
      const username2 = "player2";
      const player1 = { username: username1 };
      const player2 = { username: username2 };

      lobby.addPlayer(player1);
      lobby.addPlayer(player2);

      assert.ok(lobby.isFull());
    });

    describe("startGame", () => {
      it("should start a game with existing players", () => {
        const size = 2;
        const lobby = new Lobby(size);
        const username1 = "player1";
        const username2 = "player2";
        const player1 = { username: username1 };
        const player2 = { username: username2 };
        const game = {};

        lobby.addPlayer(player1);
        lobby.addPlayer(player2);
        lobby.startGame(game);

        assert.ok(lobby.status().hasGameStarted);
      });
    });
  });
});
