const app = require("./app");

app.listen(9090, (error) => {
    if(error) {
        console.log(error);
    }
    console.log("Server is listening on port 9090...");
});