const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");


beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with all topics", () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({ body }) => {
      expect(body.topics.length).toBe(3);
      body.topics.forEach(topic => {
        const { slug, description } = topic;
        expect(typeof slug).toBe('string');
        expect(typeof description).toBe('string');
      })
    })
  });

  test("404: responds with invalid URl if given an invalid URL", () => {
    return request(app).get("/api/topicss")
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe('Invalid URL');
    });
});
});