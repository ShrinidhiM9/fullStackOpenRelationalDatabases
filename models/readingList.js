const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./user');
const Blog = require('./blog');

// ReadingList join table between users and blogs
const ReadingList = sequelize.define('ReadingList', {
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true, // createdAt and updatedAt
  tableName: 'readinglists'
});

// Associations
User.belongsToMany(Blog, { through: ReadingList, as: 'readings', foreignKey: 'userId' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readers', foreignKey: 'blogId' });

module.exports = ReadingList;
