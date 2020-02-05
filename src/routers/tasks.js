// Created by David Walshe on 05/02/2020

const express = require("express");
const Task = require("../model/task");

const router = express.Router();

// Create a task.
router.post("/tasks", async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Return all tasks.
router.get("/tasks", async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Return a task on its id.
router.get("/tasks/:id", async (req, res) => {

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
router.patch("/tasks/:id", async (req, res) => {
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

// Delete a task
router.delete("/tasks/:id", async (req, res) => {
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

module.exports = router;