const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");


app.get("/api", (req, res) => res.status(200).send({endpoints}));

app.get("/api/topics", getTopics);

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Invalid URL' });
})

module.exports = app;