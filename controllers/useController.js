const User = require('../models/user');
const bcrypt = require('bcrypt');

// GET all users
const getAllUsers = async (req, res) => {
  const users = await User.findAll({ include: 'Blogs' });
  res.json(users);
};

// POST create new user
const createUser = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// PUT change username by username
const updateUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { newUsername } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.username = newUsername;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, createUser, updateUsername };
