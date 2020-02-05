const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled")
//   } else {
//     next()
//   }
// });

// Enables maintenance mode
app.use((req, res, next) => {
  console.log(process.env.MAINTENANCE);
  if (process.env.MAINTENANCE === "1") {
    res.status("503").send("Service is currently under maintenance")
  } else {
    next()
  }
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Start server and bring up port.
app.listen(port, () => {
  console.log("Server is up on port " + port)
});

const jwt = require("jsonwebtoken");

const myFunc = async () => {
  const token = jwt.sign({_id: "abc123"}, "thisismytoken", {expiresIn: '1 seconds'});
  console.log(token);

  const data = jwt.verify(token, "thisismytoken");
  console.log(data)
};

myFunc();