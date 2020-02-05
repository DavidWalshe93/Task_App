// Created by David Walshe on 05/02/2020

const express = require("express");
const User = require("../model/user");

const router = new express.Router();

// Create a user
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Retrieve all Users
router.get("/users", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});


// Retrieve a User by ID
router.get("/users/:id", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
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

// Delete a user
router.delete("/users/:id", async (req, res) => {
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

module.exports = router;