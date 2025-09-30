const express = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');
const ReadingList = require('../models/readingList');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/:id?read=true/false
router.get('/:id', authenticateToken, async (req, res) => {
  const { read } = req.query;
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        through: {
          model: ReadingList,
          where: read !== undefined ? { read: read === 'true' } : undefined,
          attributes: ['id', 'read']
        }
      }
    ]
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    name: user.name,
    username: user.username,
    readings: user.readings.map(blog => ({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      year: blog.year,
      readinglists: blog.ReadingList ? [{ id: blog.ReadingList.id, read: blog.ReadingList.read }] : []
    }))
  });
});

module.exports = router;
