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
   let data = require('../subscription.json')
   for (let i = 0; i < data.length; i++) {
     delete data[i].id
     data[i].createdAt = new Date()
     data[i].updatedAt = new Date()
   }

   await queryInterface.bulkInsert('Subscriptions', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Subscriptions', null)
  }
};
