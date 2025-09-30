const express = require('express');
const ReadingList = require('./models/readinglist');
const Blog = require('./models/blog');
const User = require('./models/user');
const { authenticateToken } = require('./middleware/auth');

const router = express.Router();

// POST /api/readinglists -> add blog to user's reading list
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id;

    const existing = await ReadingList.findOne({ where: { userId, blogId } });
    if (existing) return res.status(400).json({ error: 'Blog already in reading list' });

    const reading = await ReadingList.create({ userId, blogId, read: false });
    res.status(201).json(reading);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/readinglists/:id -> mark as read
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const reading = await ReadingList.findByPk(req.params.id);
    if (!reading) return res.status(404).json({ error: 'Reading list entry not found' });

    if (reading.userId !== req.user.id)
      return res.status(403).json({ error: 'You can only modify your own reading list' });

    reading.read = req.body.read;
    await reading.save();
    res.json(reading);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
