'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('readinglists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
        onDelete: 'CASCADE'
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('readinglists');
  }
};
