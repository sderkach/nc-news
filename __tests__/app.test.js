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
  test("200: Responds with all topics", () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({ body: { topics } }) => {
      expect(topics.length).toBe(3);
      topics.forEach(topic => {
        const { slug, description } = topic;
        expect(typeof slug).toBe('string');
        expect(typeof description).toBe('string');
      })
    })
  });

  test("404: Responds with 'Invalid URL' if given an invalid URL", () => {
    return request(app).get("/api/topicss")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid URL');
    });
  });
});

describe("GET /api/articles/:article_id", () => { 
  test("200: Responds with one article with given ID", () => {
    
    return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then(( { body: { article } }) => {
      const { author, title, article_id, body, topic, created_at, votes, article_img_url } = article;
      expect(article_id).toBe(3);
      expect(typeof author).toBe("string");
      expect(typeof title).toBe("string");
      expect(typeof body).toBe("string");
      expect(typeof topic).toBe("string");
      expect(typeof created_at).toBe("string");
      expect(typeof votes).toBe("number");
      expect(typeof article_img_url).toBe("string");
    });
  });
  
  test("404: Responds with 'Resource not found' when given a valid article_id that is not in the database", () => {
    return request(app)
    .get("/api/articles/999999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource not found");
    });
  });

  test("400: Responds with 'Bad request' when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/article_id")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
  });
});
