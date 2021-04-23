'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let data = require('../lecturers.json')
   for (let i = 0; i < data.length; i++) {
     delete data[i].id
     data[i].createdAt = new Date()
     data[i].updatedAt = new Date()
   }

   await queryInterface.bulkInsert('Lecturers', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Lecturers', null)
  }
};
