// Created by David Walshe on 12/02/2020

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/model/user");
const Task = require("../../src/model/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Bob",
    email: "bob@example.ie",
    password: "qwerty2000",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Mary",
    email: "mary@example.ie",
    password: "MyPass2020",
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First Task",
    completed: false,
    owner: userOne._id
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second Task",
    completed: true,
    owner: userOne._id
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third Task",
    completed: true,
    owner: userTwo._id
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();

};

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    setupDatabase
};