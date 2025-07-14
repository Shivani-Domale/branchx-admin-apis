'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove 'fullName' column
   // await queryInterface.removeColumn('Admins', 'fullName');
  },

  async down(queryInterface, Sequelize) {
    // Re-add 'fullName' column (rollback)
    await queryInterface.addColumn('Admins', 'fullName', {
      type: Sequelize.STRING,
      allowNull: true
    });

  }
};
