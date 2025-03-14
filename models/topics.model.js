const db = require("../db/connection");

exports.selectTopics = () => {
    const queryStr = 'SELECT slug, description FROM topics;'
    return db.query(queryStr)
    .then(({ rows }) => rows);
};

exports.checkTopicExists = (slug) => {
    const queryStr = 'SELECT slug FROM topics WHERE slug = $1;'
    return db.query(queryStr, [slug])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic not found"})
        }
        return rows});
};