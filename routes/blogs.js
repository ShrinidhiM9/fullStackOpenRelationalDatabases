const express = require('express');
const { Op, fn, col } = require('sequelize');
const Blog = require('../models/blog');

const router = express.Router();

/* GET /api/blogs
   Optional search (title or author) and order by likes DESC */
router.get('/', async (req, res) => {
  const { search } = req.query;

  let whereCondition = {};
  if (search) {
    whereCondition = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } }
      ]
    };
  }

  const blogs = await Blog.findAll({
    where: whereCondition,
    order: [['likes', 'DESC']]
  });
  res.json(blogs);
});

/* POST /api/blogs */
router.post('/', async (req, res) => {
  const { author, title, url, likes } = req.body;
  const newBlog = await Blog.create({ author, title, url, likes });
  res.status(201).json(newBlog);
});

/* DELETE /api/blogs/:id */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Blog.destroy({ where: { id } });
  if (deleted) res.status(204).end();
  else res.status(404).json({ error: 'Blog not found' });
});

/* PUT /api/blogs/:id */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  const blog = await Blog.findByPk(id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });

  blog.likes = likes;
  await blog.save();
  res.json(blog);
});

/* GET /api/authors - Exercise 13.16 */
router.get('/authors', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'articles'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[fn('SUM', col('likes')), 'DESC']]
  });
  res.json(authors);
});

module.exports = router;
