const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId, insertComment, deleteCommentById } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err));
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    selectArticleById(article_id)
    .then(() => insertComment(article_id, username, body))
    .then(comment => res.status(201).send({ comment }))
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;

    deleteCommentById(comment_id)
    .then(() => res.status(204).send())
    .catch(err => next(err));
};