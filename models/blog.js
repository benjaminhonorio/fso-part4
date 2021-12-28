const mongoose = require("mongoose");
const config = require("../utils/config");

const mongoUrl = config.MONGODB_URI;
console.log(`Connecting to ${mongoUrl}`);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

module.exports = mongoose.model("Blog", blogSchema);
