const express = require("express");
require("./db/mongoose");
const User = require("./model/user");
const Task = require("./model/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//------------------------------------------------------------------
// User Endpoints
//------------------------------------------------------------------

// Create a user
app.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Retrieve all Users
app.get("/users", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});


// Retrieve a User by ID
app.get("/users/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }

        res.send(user);
    } catch (e) {
        res.status(500).send(e)
    }
});

// Update data for a user.
app.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates"})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,          // Return newly updated user, not pre-modified user.
                runValidators: true // Ensure data is in line with Model Validation
            });
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send()
        }

        res.send(user);
    } catch (e) {
        res.status(500).send(e)
    }
});

//------------------------------------------------------------------
// Task Endpoints
//------------------------------------------------------------------

// Create a task.
app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Return all tasks.
app.get("/tasks", async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Return a task on its id.
app.get("/tasks/:id", async (req, res) => {

    const _id = req.params.id;

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
});

// Update a field in a Task document.
app.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send()
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete("/tasks/:id", async (req, res) => {
   const task = await Task.findByIdAndDelete(res.params.id);
   try {
       if (!task) {
           return res.status(404).send();
       }

       res.send(task);
   } catch (e) {
       res.status(500).send(e);
   }
});

// Start server and bring up port.
app.listen(port, () => {
    console.log("Server is up on port " + port)
});