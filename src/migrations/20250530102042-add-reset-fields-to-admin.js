'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Admins', 'resetToken', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Admins', 'resetTokenExpire', {
      type: Sequelize.DATE,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Admins', 'resetToken');
    await queryInterface.removeColumn('Admins', 'resetTokenExpire');
  },
};
// This migration adds resetToken and resetTokenExpires fields to the Admin model
