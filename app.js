const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controller/blogs");
const app = express();

console.log(`Connecting to ${config.MONGODB_URI}`);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
