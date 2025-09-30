const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blogapp', 'postgres', 'sql#1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

module.exports = { sequelize, connectDB };
