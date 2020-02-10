// Created by David Walshe on 05/02/2020

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const auth = require("../middleware/auth");
const maintenance = require("../middleware/maintenance");
const multer = require('multer');

const router = new express.Router();

const upload = multer({
    dest: 'images'
});

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

// Image upload
router.post("/users/me/avatar", upload.single('avatar'), async (req, res) => {
    try {
        res.send()
    } catch (e) {
        res.status(500).send()
    }
});

// Retrieve all Users
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
});


// Update data for a user.
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates"})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete a user
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;