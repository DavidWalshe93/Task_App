// Created by David Walshe on 05/02/2020

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const auth = require("../middleware/auth");
const maintenance = require("../middleware/maintenance");

const router = new express.Router();

// Create a user
router.post("/users", async (req, res) => {
    const newUser = new User(req.body);

    try {
        await newUser.save();
        // Send back a login token for the new user.
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login user
router.post("/users/login", async (req, res) => {
    try {
        // Send back a login token for the login user.
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
});

// Logout user
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send()
    } catch (e) {
        res.status(500).send()
    }
});

// // Logout all users
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send()
    }
});

// Retrieve all Users
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
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
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

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