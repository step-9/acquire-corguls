const request = require("supertest");
const { describe, it } = require("node:test");
const { createApp } = require("../src/app");

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
});
