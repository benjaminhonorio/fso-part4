const listHelper = require("../utils/list_helper");
const blogs = require("./blogs");

describe("author with most likes", () => {
  test("when there are many blogs", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({author: "Edsger W. Dijkstra", likes: 17});
  });
});
