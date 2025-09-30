'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Session.init({
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    expiresAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: true
  });

  return Session;
};
