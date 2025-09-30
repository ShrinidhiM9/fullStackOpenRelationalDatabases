const express = require('express');
require('express-async-errors'); // for async error handling
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { connectDB, sequelize } = require('./db');
const Blog = require('./models/blog');
const User = require('./models/user');
const Session = require('./models/session'); // make sure you have Session model
const { Op, fn, col } = require('sequelize');

const app = express();
app.use(express.json());

// =======================
// Connect to database
// =======================
connectDB()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

// =======================
// Middleware: authenticate session
// =======================
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  const session = await Session.findOne({ where: { token } });
  if (!session) return res.status(401).json({ error: 'Invalid session' });

  const user = await User.findByPk(session.userId);
  if (!user || user.disabled) return res.status(403).json({ error: 'Access disabled' });

  req.user = user;
  next();
};

// ===============================
// Exercise 13.13 & 13.14 & 13.15
// GET /api/blogs with optional search filter
// Search in title or author
// Order by likes descending
// ===============================
app.get('/api/blogs', async (req, res) => {
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

// ===============================
// Exercise 13.4, 13.6: CRUD for blogs
// POST /api/blogs
// DELETE /api/blogs/:id
// PUT /api/blogs/:id (update likes)
// ===============================
app.post('/api/blogs', authenticate, async (req, res) => {
  const { author, title, url, likes } = req.body;
  const newBlog = await Blog.create({ author, title, url, likes });
  res.status(201).json(newBlog);
});

app.delete('/api/blogs/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const deleted = await Blog.destroy({ where: { id } });
  if (deleted) res.status(204).end();
  else res.status(404).json({ error: 'Blog not found' });
});

app.put('/api/blogs/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  const blog = await Blog.findByPk(id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });

  blog.likes = likes;
  await blog.save();
  res.json(blog);
});

// ===============================
// Exercise 13.8 & 13.9
// Users routes
// ===============================
app.post('/api/users', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, username, password: hashedPassword, disabled: false });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.errors ? error.errors.map(e => e.message) : error.message });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.findAll({ include: Blog });
  res.json(users);
});

app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const { newUsername } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.username = newUsername;
  await user.save();
  res.json(user);
});

// ===============================
// Exercise 13.10: login
// ===============================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || user.disabled) return res.status(401).json({ error: 'Invalid username or user disabled' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

  // create server-side session
  const token = crypto.randomBytes(32).toString('hex');
  await Session.create({ userId: user.id, token });

  res.json({ token, username: user.username, name: user.name });
});

// ===============================
// Exercise 13.24: logout
// DELETE /api/logout
// ===============================
app.delete('/api/logout', authenticate, async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'Token missing' });

  await Session.destroy({ where: { token } });
  res.json({ message: 'Logged out successfully' });
});

// ===============================
// Exercise 13.16: /api/authors
// ===============================
app.get('/api/authors', async (req, res) => {
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

// =======================
// Error handler middleware
// =======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
