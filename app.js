const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { customErrorHandler, psqlErrorHandler } = require("./controllers/errors.controller");

app.get("/api", (req, res) => res.status(200).send({endpoints}));

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Invalid URL' });
})

app.use(psqlErrorHandler);

app.use(customErrorHandler);

module.exports = app;
