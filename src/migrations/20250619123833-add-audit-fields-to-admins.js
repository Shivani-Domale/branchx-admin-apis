'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Admins', 'createdBy', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Admins', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Admins', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Admins', 'createdBy');
    await queryInterface.removeColumn('Admins', 'updatedBy');
    await queryInterface.removeColumn('Admins', 'deletedAt');
  }
};
