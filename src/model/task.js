// Created by David Walshe on 04/02/2020
// Contains mongoose model for Task.

const mongoose = require("mongoose");

// Mongoose Model for Tasks

const Task = mongoose.model("Task", {
    description:  {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: true
    }
});

module.exports = Task;