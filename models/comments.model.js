const db = require("../db/connection");
const { selectArticleById } = require("./articles.model");

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `
    SELECT 
    comment_id,
    votes,
    created_at,
    author,
    body,
    article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;
    
    const promises = [
        selectArticleById(article_id),
        db.query(queryStr, [article_id])
    ];

    return Promise.all(promises)
    .then(([_, { rows }]) => rows);
};