const db = require("../db/connection");
const { checkTopicExists } = require("./topics.model");

exports.selectArticleById = (article_id) => {
    const queryStr = `
            SELECT 
                articles.author, 
                articles.title, 
                articles.article_id, 
                articles.body, 
                articles.topic, 
                articles.created_at, 
                articles.votes, 
                articles.article_img_url, 
                COUNT(comments.comment_id)::int AS comment_count 
            FROM articles 
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;
        `;

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

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
    const validColumns = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url", "comment_count"];
    const validOrders = ["asc", "desc"];
    let checkTopic;

    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ 
            status: 400, 
            msg: "Invalid sort_by column" 
        });
    }

    if (!validOrders.includes(order.toLowerCase())) {
        return Promise.reject({ 
            status: 400, 
            msg: "Invalid order query" 
        });
    }

    const queryValues = [];
    let queryStr = `
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
    `;

    if (topic) {
        checkTopic = checkTopicExists(topic);
        queryStr += ` WHERE topic = $1`
        queryValues.push(topic);
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()};`;
    const promises = [checkTopic, db.query(queryStr, queryValues)];
    return Promise.all(promises)
    .then(([_, { rows }]) => rows);
};

exports.updateArticle = (article_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({
            status: 400,
            msg: "Missing required fields" 
        });
    }
    const queryStr = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`;
    
    return db.query(queryStr, [inc_votes, article_id])
    .then(({ rows }) => rows[0]);

};