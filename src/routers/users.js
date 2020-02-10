// Created by David Walshe on 05/02/2020

const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const sharp = require('sharp')
const User = require("../model/user");
const auth = require("../middleware/auth");
const maintenance = require("../middleware/maintenance");


const router = new express.Router();

// Sets up upload constraints for avatar
const upload = multer({
    limits: {
        fileSize: 1_000_000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return callback(new Error('The file must be in the format: ".png", ".jpg" or ".jpeg"'))
        }

        callback(undefined, true);
    }
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
router.post("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
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

// Delete user's avatar image.
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    req.user.save();
    res.send()
});


// Allows users or end-point devices to retrieve avatar image for a user.
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            return new Error("No user or avatar associated with user")
        }

        res.set('Content-Type', 'image/png').send(user.avatar);
    } catch (e) {
        res.status(404).send()
    }
});

module.exports = router;