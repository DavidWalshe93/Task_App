// Created by David Walshe on 05/02/2020
// Connect to mongodb instance.

const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URL, {
    userNewUrlParser: true,
    useCreateIndex: true
});
