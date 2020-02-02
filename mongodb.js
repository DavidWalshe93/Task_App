

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
        return console.log("Unable to connect to database")
    }

    // Get database handle
    const db = client.db(databaseName);

    // // Add a document to a collection
    // db.collection("users").insertOne({
    //     name: "Dave",
    //     age: 26
    // }, (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert user")
    //     }
    //     console.log(result.ops)
    // });

    db.collection("users", ).insertMany([
        {
            name: "Ryan",
            age: 21
        }, {
            name: "Grace",
            age: 26
        }
        ], (error, result) => {
        if (error) {
            return console.log(result.ops);
        }

        console.log(result.ops)
    })
});

