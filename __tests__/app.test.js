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

describe("ALL /notAPath", () => {
  test("404: Responds with 'Invalid URL' when attempting to access a non-existent endpoint", () => {
    return request(app).get("/notAPath")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid URL');
    });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with all topics", () => {
    return request(app)
    .get("/api/topics")
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
});

describe("GET /api/articles/:article_id", () => { 
  test("200: Responds with one article with given ID", () => {
    const expectedArticle = {
      author: 'icellusedkars',
      title: 'Eight pug gifs that remind me of mitch',
      article_id: 3,
      body: 'some gifs',
      topic: 'mitch',
      created_at: '2020-11-03T09:12:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }

    return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then(( { body: { article } }) => {
      const { article_id } = article;
      expect(article_id).toBe(3);
      expect(article).toMatchObject(expectedArticle);
    });
  });
  
  test("404: Responds with 'Article not found' when given a valid article_id that is not in the database", () => {
    return request(app)
    .get("/api/articles/999999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
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

describe("GET /api/articles", () => {
  test("200: Responds with an articles array of article objects, sorted by date in descending order", () => {
    const expectedArticle = {
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
      comment_count: expect.any(Number)
    }
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(13);
      expect(articles).toBeSortedBy('created_at', { descending: true });
      articles.forEach(article => {
        expect(article).toEqual(expect.objectContaining(expectedArticle));
      });
    })
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id, sorted by most recent first", () => {
    const expectedComment = {
      comment_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      article_id: 1
    }
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments.length).toBe(11);
      expect(comments).toBeSortedBy('created_at', { descending: true });
      comments.forEach(comment => {
        expect(comment).toEqual(expect.objectContaining(expectedComment));
      });
    })
  });

  test("200: Responds with an empty array when article has no comments", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body: { comments }}) => {
      expect(comments.length).toBe(0);
      expect(comments).toEqual([]);
    });
  });

  test("404: Responds with 'Article not found' when given article_id does not exist", () => {
    return request(app)
    .get("/api/articles/999999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
  });

  test("400: Responds with 'Bad request' when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/notAnId/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
  });
});