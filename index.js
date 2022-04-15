const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/user");

const url = process.env.URL;
mongoose
  .connect(url)
  .then(() => console.log("DB connected successfully"))
  .catch(() => console.log("failed to connect DB"));


app.use(express.json());
app.use("/users", userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
