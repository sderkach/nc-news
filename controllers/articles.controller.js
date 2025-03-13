const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then(article => res.status(200).send({ article }))
    .catch(err => next(err));
};

exports.getArticles = (req, res, next) => {
    const { sort_by, order } = req.query;
    selectArticles(sort_by, order)
    .then(articles => res.status(200).send({ articles }))
    .catch(err => next(err));
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    selectArticleById(article_id)
    .then(() => updateArticle(article_id, inc_votes))
    .then(article => res.status(200).send({ article }))
    .catch(err => next(err));
};