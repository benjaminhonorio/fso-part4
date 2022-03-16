const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post(
  '/',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const { user } = request
    const blog = Blog({ ...request.body, user: user._id })
    if (!blog.title && !blog.url) {
      return response.status(400).end()
    }
    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
    return response.status(201).json(newBlog)
  }
)

blogsRouter.delete(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const { token, user } = request
    const { id } = token
    if (id) {
      if (user._id.toString() === id) {
        await Blog.findByIdAndRemove(request.params.id)
        return response.status(204).end()
      } else {
        return response.status(401).json({ error: 'user not allowed' })
      }
    } else {
      response.status(401).json({ error: 'missing or invalid token' })
    }
  }
)

blogsRouter.put(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const body = request.body
    const blog = {
      ...body.blog,
      likes: body.likes,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    })
    response.json(updatedBlog)
  }
)

module.exports = blogsRouter
