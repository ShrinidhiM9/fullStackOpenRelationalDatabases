const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // cannot be empty
    validate: {
      notEmpty: { msg: "Name must not be empty" }
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false, // cannot be empty
    unique: true, // must be unique
    validate: {
      notEmpty: { msg: "Username must not be empty" },
      isEmail: { msg: "Username must be a valid email" } // Exercise 13.9
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password must not be empty" }
    }
  }
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
  tableName: 'users'
});

// Define association: one user can have many blogs
User.associate = (models) => {
  User.hasMany(models.Blog, { foreignKey: 'userId' });
};

module.exports = User;
