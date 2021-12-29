const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("there are to blogs in the list", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(2);
}, 100000);

test("the unique identifier of the blog post is named id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  expect(blog.id).toBeDefined();
});

test("a valid new blog post can be added", async () => {
  const newBlogPost = {
    title: "New Blog Post",
    author: "Benjamin H",
    url: "http://example.com",
    likes: 12,
  };
  await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await api.get("/api/blogs");
  expect(blogsAtEnd.body).toHaveLength(3);

  const titles = blogsAtEnd.body.map((b) => b.title);

  expect(titles).toContain("New Blog Post");
});

test("a new blog post with missing likes can be added and set default to 0", async () => {
  const newBlogPost = {
    title: "Other Blog Post",
    author: "Carlos H",
    url: "http://example2.com",
  };
  await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await api.get("/api/blogs");
  expect(blogsAtEnd.body).toHaveLength(4);

  const likesArray = blogsAtEnd.body.map((b) => b.likes);
  expect(likesArray).toContain(0);

  const titles = blogsAtEnd.body.map((b) => b.title);
  expect(titles).toContain("Other Blog Post");
});

afterAll(() => {
  mongoose.connection.close();
});
