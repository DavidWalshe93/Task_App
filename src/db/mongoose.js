const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    userNewUrlParser: true,
    useCreateIndex: true
});

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                    throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain the word 'password'")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    }
});

const me = new User({
    name: "    Tom    ",
    password: "mySecret",
    email: "TOM@TEST.COM   "
});

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log("ERROR: ", error)
});

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

const task = new Task({
    description: "This is a task",
    completed: false
});

task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log(error)
});
