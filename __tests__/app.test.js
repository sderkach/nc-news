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
  test("200: Responds with an articles array of article objects, sorted by date in descending order", () => {
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

  test("200: Responds with articles sorted by given column in descending order (default)", () => {
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(13);
      expect(articles).toBeSortedBy("votes", { descending: true });
      articles.forEach(article => {
        expect(article).toEqual(expect.objectContaining(expectedArticle));
      });
    });
  });

  test("200: Responds with articles sorted by given column in ascending order when order=asc is passed", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&order=asc")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(13);
      expect(articles).toBeSortedBy("votes", { descending: false });
      articles.forEach(article => {
        expect(article).toEqual(expect.objectContaining(expectedArticle));
      });
    });
  });

  test("200: Responds with articles filtered by given topic", () => {
    return request(app)
    .get("/api/articles?topic=cats")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(1);
      articles.forEach(article => {
        expect(article.topic).toBe("cats");
        expect(article).toEqual(expect.objectContaining(expectedArticle));
      });
    });
  });

  test("200: Responds with articles filtered by given topic, sorted by given column in ascending order", () => {
    return request(app)
    .get("/api/articles?topic=mitch&sort_by=comment_count&order=asc")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(12);
      expect(articles).toBeSortedBy("comment_count", { descending: false });
      articles.forEach(article => {
        expect(article.topic).toBe("mitch");
        expect(article).toEqual(expect.objectContaining(expectedArticle));
      });
    });
  });

  test("404: Responds with 'No articles found for the specified topic.' when there are no articles with the given topic", () => {
    return request(app)
    .get("/api/articles?topic=coding&sort_by=comment_count&order=asc")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No articles found for the specified topic");
    });
  });

  test("400: Responds with 'Invalid sort_by column' when given invalid sort_by column", () => {
    return request(app)
    .get("/api/articles?sort_by=notAColumn")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid sort_by column");
    });
  });

  test("400: Responds with 'Invalid order query' when given invalid order value", () => {
    return request(app)
    .get("/api/articles?order=invalid")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid order query");
    });
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const expectedComment = {
      article_id: 2,
      author: "icellusedkars",
      body: "This is my first comment",
      comment_id: 19,
      created_at: expect.any(String),
      votes: 0
    }
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      username: "icellusedkars",
      body: "This is my first comment"
    })
    .expect(201)
    .then(({ body: { comment } }) => {
      expect(comment).toMatchObject(expectedComment);
    });
  });

  test("404: Responds with 'Article not found' when given article_id does not exist", () => {
    return request(app)
    .post("/api/articles/999999/comments")
    .send({
      username: "icellusedkars",
      body: "This is my first comment"
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
  });

  test("400: Responds with 'Missing required fields' when request body is missing correct fields", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      user: "icellusedkars",
      body: "This is my first comment"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing required fields");
    });
  });

  test("400: Responds with 'Invalid comment body' when body is not a string", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      username: "icellusedkars",
      body: 12345
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid comment body");
    });
  });

  test("400: Responds with 'Foreign key violation' when a username doesn't exist", () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({
      username: "serhii",
      body: "This is my first comment"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Foreign key violation");
    });
  });

});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increments article votes by 20 and responds with the updated article", () => {
    const updatedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 120,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: 20
    })
    .expect(200)
    .then(({ body: { article } }) => {
      expect(article).toMatchObject(updatedArticle);
    });
  });

  test("200: Decrements article votes by 20 and responds with the updated article", () => {
    const updatedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 80,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: -20
    })
    .expect(200)
    .then(({ body: { article } }) => {
      expect(article).toMatchObject(updatedArticle);
    });
  });

  test("404: Responds with 'Article not found' when given article_id does not exist", () => {
    return request(app)
    .patch("/api/articles/99999")
    .send({
      inc_votes: 20
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
  });

  test("400: Responds with 'Missing required fields' when inc_votes is missing", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({
      votes: 20
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing required fields");
    });
  });

  test("400: Responds with 'Bad request' when inc_votes is not a number", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: "notANumber"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment by given id and responds with no content", () => {
    return request(app)
    .delete("/api/comments/10")
    .expect(204)
    .then(({ body }) => {
      expect(body).toEqual({});
    })
  });
  test("404: Responds with 'Comment not found' when given comment_id does not exist", () => {
    return request(app)
    .delete("/api/comments/999999")
    .expect(404)
    .then(({ body }) =>{
      expect(body.msg).toBe("Comment not found");
    });
  });
  test("400: Responds with 'Bad request' when given invalid comment_id", () => {
    return request(app)
    .delete("/api/comments/notAnId")
    .expect(400)
    .then(({ body }) =>{
      expect(body.msg).toBe("Bad request");
    });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    const expectedUser = {
      username: expect.any(String),
      name: expect.any(String),
      avatar_url: expect.any(String)
    }

    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body: { users } }) => {
      expect(users.length).toBe(4);
      users.forEach(user => {
        const { username, name, avatar_url } = user;
        expect(user).toMatchObject(expectedUser);
      })
    })
  });
});