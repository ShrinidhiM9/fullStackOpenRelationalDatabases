const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user');

// Exercise 13.4: Define Blog model
const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Title must not be empty" }
    }
  },
  author: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "URL must not be empty" }
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Exercise 13.18: Year field with validation
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: { msg: "Year must be an integer" },
      min: {
        args: 1991,
        msg: "Year cannot be less than 1991"
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Year cannot be greater than ${new Date().getFullYear()}`
      }
    }
  }
}, {
  timestamps: true, // createdAt and updatedAt included automatically
  tableName: 'blogs'
});

// Exercise 13.11 & 13.12: Define associations
// Each blog belongs to one user
Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Each user can have many blogs
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' });

module.exports = Blog;
