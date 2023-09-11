const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../src/app");
const assert = require("assert");

describe("App", () => {
  describe("GET /", () => {
    it("should serve the home page", (_, done) => {
      const app = createApp();
      request(app)
        .get("/")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });
  });

  describe("GET /game", () => {
    it("should serve the game page", (_, done) => {
      const app = createApp();
      request(app)
        .get("/game")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });
  });

  describe("GET /lobby", () => {
    it("should serve the lobby page", (_, done) => {
      const app = createApp();
      request(app)
        .get("/lobby")
        .expect(200)
        .expect("content-type", new RegExp("text/html"))
        .end(done);
    });
  });

  describe("POST /players", () => {
    it("should join the player in the lobby", (_, done) => {
      const lobby = new Set();
      const app = createApp(lobby);
      const username = "player";
      request(app)
        .post("/players")
        .send({ username })
        .expect(302)
        .expect("location", "/lobby")
        .end(err => {
          assert.deepStrictEqual([...lobby], [username]);
          done(err);
        });
    });
  });

  describe("GET /players", () => {
    it("should join the player in the lobby", (_, done) => {
      const lobby = new Set();
      const username = "player";
      lobby.add(username);

      const app = createApp(lobby);

      request(app)
        .get("/players")
        .expect(200)
        .expect("content-type", new RegExp("application/json"))
        .expect([username])
        .end(done);
    });
  });
});
