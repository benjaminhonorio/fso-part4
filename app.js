require("express-async-errors");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controller/blogs");
const usersRouter = require("./controller/users");
const loginRouter = require("./controller/login");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("./utils/middleware");
const logger = require("./utils/logger");
const app = express();

logger.info(`Connecting to ${config.MONGODB_URI}`);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(tokenExtractor);
app.use("/api/blogs", userExtractor, blogsRouter);
app.use(errorHandler);

module.exports = app;
