// middleware/auth.js
const { Session, User } = require('../models');

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  const session = await Session.findOne({ where: { token } });
  if (!session) return res.status(401).json({ error: 'Invalid session' });

  const user = await User.findByPk(session.userId);
  if (!user || user.disabled) {
    return res.status(403).json({ error: 'Access disabled' });
  }

  req.user = user; // attach user to request
  next();
};

module.exports = authenticate;
