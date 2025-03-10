const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
    const queryStr = 'SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;'
    
    return db.query(queryStr, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: 'Resource not found'
            });
        }
        return rows[0];
    });
};
