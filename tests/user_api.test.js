const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});
describe("creation of new users", () => {
  test("fails with no username", async () => {
    const newUser = {
      password: "locaza",
      name: "susy",
    };
    const response = await api.post("/api/users").send(newUser).expect(400);
    const { error = "" } = response;
    expect(error.text).toContain("username is required");
    const { body } = await api.get("/api/users");
    expect(body.length).toBe(0);
  });
  test("fails with no password", async () => {
    const newUser = {
      username: "suyeliza",
      name: "susy",
    };
    const response = await api.post("/api/users").send(newUser).expect(400);
    const { error = "" } = response;
    expect(error.text).toContain("password is required");
    const { body } = await api.get("/api/users");
    expect(body.length).toBe(0);
  });
  test("fails with password less than 3 characters long", async () => {
    const newUser = {
      username: "suyeliza",
      password: "as",
      name: "susy",
    };
    const response = await api.post("/api/users").send(newUser).expect(400);
    const { error = "" } = response;
    expect(error.text).toContain("password must be at least 3 characters long");
    const { body } = await api.get("/api/users");
    expect(body.length).toBe(0);
  });
  test("fails with username less than 3 characters long", async () => {
    const newUser = {
      username: "as",
      password: "suyeliza",
      name: "susy",
    };
    const response = await api.post("/api/users").send(newUser).expect(400);
    const { error = "" } = response;
    expect(error.text).toContain("username must be at least 3 characters long");
    const { body } = await api.get("/api/users");
    expect(body.length).toBe(0);
  });
  test("success with correct data", async () => {
    const newUser = {
      username: "suyeliza",
      password: "suyeliza",
      name: "susy",
    };
    await api.post("/api/users").send(newUser).expect(201);
    const { body } = await api.get("/api/users");
    expect(body.length).toBe(1);
  });
});
afterAll(() => {
  mongoose.connection.close();
});
