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

exports.insertComment = (article_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({
            status: 400,
            msg: "Missing required fields" 
        });
    }

    if (typeof body !== "string") {
        return Promise.reject({ status: 400, msg: "Invalid comment body" });
    }

    const queryStr = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) 
    RETURNING *;
    `;
    
    return db.query(queryStr, [article_id, username, body])
    .then(({ rows }) => rows[0]);
};