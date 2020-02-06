// Created by David Walshe on 05/02/2020

const express = require("express");
const Task = require("../model/task");
const auth = require("../middleware/auth");

const router = new express.Router();

// Create a task.
router.post("/tasks", auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Return all tasks.
router.get("/tasks", auth, async (req, res) => {

    try {
        // const tasks = await Task.find({owner: req.user._id});
        await req.user.populate("tasks").execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

// Return a task on its id.
router.get("/tasks/:id", auth, async (req, res) => {

    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
});

// Update a field in a Task document.
router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send()
    }

    try {

        // Enables the use of mongoose middleware.
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
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