const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("author", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  let token = request.get("authorization");

  if (token && token.toLowerCase().startsWith("bearer ")) {
    token = token.substring(7);
  } else {
    return response.status(401).json({ error: "missing or invalid token" });
  }
  const { id } = jwt.verify(token, process.env.SECRET);
  if (id) {
    const user = await User.findById(id);
    const blog = Blog({ ...request.body, author: user._id });
    if (!blog.title && !blog.url) {
      return response.status(400).end();
    }
    const newBlog = await blog.save();
    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();
    return response.status(201).json(newBlog);
  } else {
    response.status(401).json({ error: "missing or invalid token" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    ...body.blog,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
