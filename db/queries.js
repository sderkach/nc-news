const db = require("./connection.js");

// To view results run this command:
// node db/queries.js > output.txt

// Get all of the users
db.query('SELECT * FROM users;')
.then(({ rows }) => {
    console.log("\nAll users: \n", rows);
    // Get all of the articles where the topic is coding
    return db.query("SELECT * FROM articles WHERE topic = 'coding';");
})
.then(({ rows }) => {
    console.log("\nComments about coding: \n", rows);
    // Get all of the comments where the votes are less than zero
    return db.query('SELECT * FROM comments WHERE votes < 0;');
})
.then(({ rows }) => {
    console.log("\nComments with negative votes: \n", rows);
    // Get all of the topics
    return db.query('SELECT * FROM topics;');
})
.then(({ rows }) => {
    console.log("\nAll topics: \n", rows);
    // Get all of the articles by user grumpy19
    return db.query("SELECT * FROM articles WHERE author = 'grumpy19';");
})
.then(({ rows }) => {
    console.log("\nArticles by grumpy19: \n", rows);
    // Get all of the comments that have more than 10 votes.
    return db.query('SELECT * FROM comments WHERE votes > 10;');
})
.then(({ rows }) => {
    console.log("\nComments with more than 10 votes: \n", rows);
    db.end();
})
.catch(err => console.log(err));
