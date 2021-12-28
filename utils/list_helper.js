const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
};

const favoriteBlogs = (blogs) => {
  const favorite = blogs.reduce((mostLiked, blog) => {
    return mostLiked.likes >= blog.likes ? mostLiked : blog;
  });
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

module.exports = { dummy, totalLikes, favoriteBlogs };
