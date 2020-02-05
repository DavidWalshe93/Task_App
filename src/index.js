const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Start server and bring up port.
app.listen(port, () => {
    console.log("Server is up on port " + port)
});

