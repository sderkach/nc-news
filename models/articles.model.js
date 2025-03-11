const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
    const queryStr = 'SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;'
    
    return db.query(queryStr, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: 'Article not found'
            });
        }
        return rows[0];
    });
};

exports.selectArticles = () => {
    const queryStr = `
        SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id)::int AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `;
    
    return db.query(queryStr)
    .then(({ rows }) => rows);
};