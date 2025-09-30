const Blog = require('../models/blog');
const User = require('../models/user');

// GET all blogs with user info
const getAllBlogs = async (req, res) => {
  const blogs = await Blog.findAll({ include: User });
  res.json(blogs);
};

// POST create blog linked to user
const createBlog = async (req, res, next) => {
  try {
    const { author, title, url, likes, userId } = req.body;
    const blog = await Blog.create({ author, title, url, likes, UserId: userId });
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

// DELETE blog only if belongs to user
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // get userId from auth token in real scenario
  const blog = await Blog.findByPk(id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  if (blog.UserId !== userId) return res.status(403).json({ error: 'Not authorized' });
  await blog.destroy();
  res.status(204).end();
};

// PUT update likes
const updateLikes = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  const blog = await Blog.findByPk(id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  blog.likes = likes;
  await blog.save();
  res.json(blog);
};

module.exports = { getAllBlogs, createBlog, deleteBlog, updateLikes };
