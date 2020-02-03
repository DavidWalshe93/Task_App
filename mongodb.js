const {MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
        return console.log("Unable to connect to database")
    }

    // Get database handle
    const db = client.db(databaseName);

    db.collection("users").findOne({ _id: new ObjectID("5e3743d766fefc193c4c863e")}, (error, user) => {
        if (error) {
            return console.log("Unable to fetch")
        }

        console.log(user)
    });

    // Find and print all the documents in user where the age is 27.
    db.collection("users").find({ age: 26 }).toArray((error, users) => {
        console.log(users)

    });

    // Find how many documents match the age of 26 in the users collection.
    db.collection("users").find({ age: 26 }).count((error, count) => {
        console.log(count)
    });

    db.collection("tasks").findOne({_id: new ObjectID("5e37449b4e7f154a00c9a1ac")}, (error, task) => {
        console.log(task)
    });

    db.collection("tasks").find({completed: false}).toArray((error, tasks) => {
        console.log(tasks)
    });
});

