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

const mostBlogs = (blogs) => {
  let mostBlogsAuthor = null;

  const authors = blogs.reduce((authorsMap, { author }) => {
    authorsMap[author] = 1 + authorsMap[author] || 1;
    return authorsMap;
  }, {});

  for (author in authors) {
    if (!mostBlogsAuthor || authors[author] > mostBlogsAuthor.blogs) {
      mostBlogsAuthor = { author, blogs: authors[author] };
    }
  }
  return mostBlogsAuthor;
};

const mostLikes = (blogs) => {
  let mostLikedAuthor = null;

  const authors = blogs.reduce((authorsMap, { author, likes }) => {
    authorsMap[author] = likes + authorsMap[author] || likes;
    return authorsMap;
  }, {});

  for (author in authors) {
    if (!mostLikedAuthor || authors[author] > mostLikedAuthor.likes) {
      mostLikedAuthor = { author, likes: authors[author] };
    }
  }
  return mostLikedAuthor;
};

module.exports = { dummy, totalLikes, favoriteBlogs, mostBlogs, mostLikes };
