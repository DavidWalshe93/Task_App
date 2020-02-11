const app = require("./app");

const port = process.env.PORT;

// Start server and bring up port.
app.listen(port, () => {
    console.log("Server is up on port " + port)
});