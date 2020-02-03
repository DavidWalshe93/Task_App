const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    userNewUrlParser: true,
    useCreateIndex: true
});

const User = mongoose.model("User", {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const me = new User({
    name: "Dave",
    age: 27
});

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log("ERROR: ", error)
});