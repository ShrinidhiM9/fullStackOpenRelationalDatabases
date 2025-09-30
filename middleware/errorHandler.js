const { ValidationError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ error: messages });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
