const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles, patchArticleById } = require("./controllers/articles.controller");
const { customErrorHandler, psqlErrorHandler, invalidPathController, serverErrorHandler } = require("./controllers/errors.controller");
const { getCommentsByArticleId, postComment, deleteComment } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.all('*', invalidPathController);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
