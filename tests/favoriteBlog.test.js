const blogs = require("./blogs");
const listHelper = require("../utils/list_helper");

describe("favorite blog", () => {
  test("is the one with the most likes", () => {
    const favorite = listHelper.favoriteBlogs(blogs);
    expect(favorite).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
