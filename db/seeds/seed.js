const db = require("../connection")
const {
  convertTimestampToDate,
  convertTopicsData,
  convertUsersData,
  convertArticlesData,
  convertCommentsData
} = require("./utils");

const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return dropTables()
  .then(() => {
    return createTables();
  })
  .then(() => {
    return insertTopics(topicData);
  })
  .then(() => {
    return insertUsers(userData);
  })
  .then(() => {
    return insertArticles(articleData);
  })
  .then(({ rows }) => {
    return insertComments(commentData, rows, convertTimestampToDate);
  });
};

const dropTables = () => {
  return db.query('DROP TABLE IF EXISTS comments')
  .then(() => {
    return db.query('DROP TABLE IF EXISTS articles');
  })
  .then(() => {
    return db.query('DROP TABLE IF EXISTS users');
  })
  .then(() => {
    return db.query('DROP TABLE IF EXISTS topics');
  });
};

const createTables = () => {
  return db.query(`CREATE TABLE IF NOT EXISTS topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR NOT NULL,
    img_url VARCHAR(1000)
    );`)
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    })
};

const insertTopics = (topicData) => {
  const topicsArray = convertTopicsData(topicData);
  const topicsInsertStr = format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`, topicsArray);
  return db.query(topicsInsertStr);
};

const insertUsers = (userData) => {
  const usersArray = convertUsersData(userData);
  const usersInsertStr = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`, usersArray);
  return db.query(usersInsertStr);
};

const insertArticles = (articleData) => {
  const articlesArray = convertArticlesData(articleData, convertTimestampToDate);
  const articlesInsertStr = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`, articlesArray);
  return db.query(articlesInsertStr);
};

const insertComments = (commentData, articleData, convertTimestampToDate) => {
  const commentsArray = convertCommentsData(commentData, articleData, convertTimestampToDate);
  const commentsInsertStr = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`, commentsArray);
  return db.query(commentsInsertStr);
};

module.exports = seed;
