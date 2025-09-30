'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { User, Session } = require('../models'); // adjust path if needed
const authenticate = require('../middleware/auth'); // middleware for logout

// -------------------
// POST /api/login
// -------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ where: { email } });
    if (!user || user.disabled || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials or user disabled' });
    }

    // create session
    const token = crypto.randomBytes(32).toString('hex');
    await Session.create({ userId: user.id, token });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------
// DELETE /api/logout
// -------------------
router.delete('/logout', authenticate, async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token missing' });

    // remove session
    await Session.destroy({ where: { token } });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
