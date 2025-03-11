const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { customErrorHandler, psqlErrorHandler, invalidPathController } = require("./controllers/errors.controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all('*', invalidPathController);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

module.exports = app;
