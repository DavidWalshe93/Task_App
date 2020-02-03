const {MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
        return console.log("Unable to connect to database")
    }

    // Get database handle
    const db = client.db(databaseName);

    db.collection("users").updateOne({
        _id: new ObjectID("5e3741433cf32837842e1249")
    }, {
       $inc: {
           age: 1
       }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error)
    })
});

