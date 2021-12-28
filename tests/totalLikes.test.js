const listHelper = require("../utils/list_helper");
const blogs = require("./blogs");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([blogs[0]]);
    expect(result).toBe(7);
  });
});
