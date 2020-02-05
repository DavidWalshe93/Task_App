const express = require("express");
require("./db/mongoose");

const User = require("./model/user");
const userRouter = require("./routers/users");

const Task = require("./model/task");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

// Start server and bring up port.
router.listen(port, () => {
    console.log("Server is up on port " + port)
});