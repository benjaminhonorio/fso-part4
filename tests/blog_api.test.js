const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const BLOGS_ENDPOINT = "/api/blogs";
const USERS_ENDPOINT = "/api/users";

const hook =
  (method = "post") =>
  (url, payload = {}, token = "") => {
    return api[method](url)
      .send(payload)
      .set("Authorization", `Bearer ${token}`);
  };
const request = {
  post: hook("post"),
  get: hook("get"),
  put: hook("put"),
  delete: hook("delete"),
};

describe("creation of blogs", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const createUser = {
      username: "suyeliza",
      password: "locaza",
      name: "Susy",
    };
    await api.post(USERS_ENDPOINT).send(createUser);
  });
  test("a valid new blog post can be added", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const newBlogPost = {
      title: "New Blog Post",
      url: "http://example.com",
      likes: 12,
    };
    await request
      .post(BLOGS_ENDPOINT, newBlogPost, token)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await request.get(BLOGS_ENDPOINT, {}, token);
    expect(blogsAtEnd.body).toHaveLength(1);

    const titles = blogsAtEnd.body.map((b) => b.title);

    expect(titles).toContain("New Blog Post");
  });
  test("blogs are returned as json", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    await request
      .get(BLOGS_ENDPOINT, {}, token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs in the list", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const response = await request.get(BLOGS_ENDPOINT, {}, token);
    expect(response.body).toHaveLength(1);
  });

  test("the unique identifier of the blog post is named id", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const response = await request.get(BLOGS_ENDPOINT, {}, token);
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
  });

  test("a valid new blog post can be added", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const newBlogPost = {
      title: "New Blog Post",
      url: "http://example.com",
      likes: 12,
    };
    await request
      .post(BLOGS_ENDPOINT, newBlogPost, token)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await request.get(BLOGS_ENDPOINT, {}, token);
    expect(blogsAtEnd.body).toHaveLength(2);

    const titles = blogsAtEnd.body.map((b) => b.title);
    expect(titles).toContain("New Blog Post");
  });
  test("a valid new blog post can't be added if there is no token provided", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const newBlogPost = {
      title: "New Blog Post",
      url: "http://example.com",
      likes: 12,
    };
    await request.post(BLOGS_ENDPOINT, newBlogPost).expect(401);
  });

  test("a new blog post with missing likes can be added and set default to 0", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const newBlogPost = {
      title: "Other Blog Post",
      url: "http://example2.com",
    };
    await request
      .post(BLOGS_ENDPOINT, newBlogPost, token)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await request.get(BLOGS_ENDPOINT, {}, token);
    expect(blogsAtEnd.body).toHaveLength(3);

    const likesArray = blogsAtEnd.body.map((b) => b.likes);
    expect(likesArray).toContain(0);

    const titles = blogsAtEnd.body.map((b) => b.title);
    expect(titles).toContain("Other Blog Post");
  });

  test("a new blog post without title or url will raise a bad request status code", async () => {
    const {
      body: { token },
    } = await request.post("/api/login", {
      username: "suyeliza",
      password: "locaza",
    });
    const newBlogPost = {
      author: "Carlos H",
      likes: 12,
    };
    await request.post(BLOGS_ENDPOINT, newBlogPost, token).expect(400);

    const blogsAtEnd = await request.get(BLOGS_ENDPOINT, {}, token);
    expect(blogsAtEnd.body).toHaveLength(3);
  });
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});
