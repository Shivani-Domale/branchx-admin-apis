'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("Admins", "fullName", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "phone", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "country", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "state", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "address", { type: Sequelize.STRING, allowNull: true }),,
      queryInterface.addColumn("Admins", "city", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "businessName", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "message", { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn("Admins", "status", { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn("Admins", "isDeleted", { type: Sequelize.DATE, allowNull: true }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("Admins", "fullName"),
      queryInterface.removeColumn("Admins", "phone"),
      queryInterface.removeColumn("Admins", "country"),
      queryInterface.removeColumn("Admins", "state"),
      queryInterface.removeColumn("Admins", "city"),
      queryInterface.removeColumn("Admins", "businessName"),
      queryInterface.removeColumn("Admins", "message"),
      queryInterface.removeColumn("Admins", "status"),
      queryInterface.removeColumn("Admins", "isDeleted"),
    ]);
  }
};
