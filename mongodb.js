const {MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp() );

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
        return console.log("Unable to connect to database")
    }

    // Get database handle
    const db = client.db(databaseName);

    // // Add a document to a collection
    // db.collection("users").insertOne({
    //     _id: id,
    //     name: "Dave",
    //     age: 26
    // }, (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert user")
    //     }
    //     console.log(result.ops)
    // });

    // db.collection("users", ).insertMany([
    //     {
    //         name: "Ryan",
    //         age: 21
    //     }, {
    //         name: "Grace",
    //         age: 26
    //     }
    //     ], (error, result) => {
    //     if (error) {
    //         return console.log(result.ops);
    //     }
    //
    //     console.log(result.ops)
    // })

    // db.collection("tasks").insertMany([
    //     {
    //         description: "This is task 1",
    //         completed: false
    //     },
    //     {
    //         description: "This is task 2",
    //         completed: true
    //     },
    //     {
    //         description: "This is task 3",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Error: " + result.ops)
    //     }
    //
    //     console.log(result.ops);
    // })

});

