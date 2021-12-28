const listHelper = require("../utils/list_helper");
const blogs = require("./blogs");

describe("author with most blogs", () => {
  test("when there are many blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
  });
});
