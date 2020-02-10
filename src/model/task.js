// Created by David Walshe on 04/02/2020
// Contains mongoose model for Task.

const mongoose = require("mongoose");

// Mongoose Model for Tasks

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;