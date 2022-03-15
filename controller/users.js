const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  const { password, username } = body;
  if (!password) {
    return res.status(400).json({ error: "password is required" });
  } else if (!username) {
    return res.status(400).json({ error: "username is required" });
  } else if (username.length < 3) {
    return res
      .status(400)
      .json({ error: "username must be at least 3 characters long" });
  } else if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });
  const userExists = await User.exists({ username: body.username });
  if (userExists) {
    return res.status(400).json({ error: "username already exists" });
  }
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
