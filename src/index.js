const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const bcrypt = require("bcryptjs");

const myFunc = async () => {
  const password = "HELLO WORLD";
  const hashedPassword = await bcrypt.hash(password, 8);

  console.log(password);
  console.log(hashedPassword);

  const isMatch = await bcrypt.compare("HELLO WORLD", hashedPassword);
  console.log(isMatch);
};

myFunc();

// Start server and bring up port.
app.listen(port, () => {
  console.log("Server is up on port " + port)
});