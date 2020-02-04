const express = require("express");
require("./db/mongoose");
const User = require("./model/user");
const Task = require("./model/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Create a user
app.post("/users", (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


// Create a task.
app.post("/tasks", (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

// Start server and bring up port.
app.listen(port, () => {
    console.log("Server is up on port " + port)
});