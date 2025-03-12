const db = require("../db/connection");

exports.selectUsers = () => {
    const queryStr = 'SELECT username, name, avatar_url FROM users';

    return db.query(queryStr)
    .then(({ rows }) => rows);
};