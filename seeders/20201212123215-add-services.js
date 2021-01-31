'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'services', [
        {
          name: 'shopping',
          displayName: 'Shopping',
          description: '',
          active: 1,
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
          live: 1
        },
        {
          name: 'grooming',
          displayName: 'Grooming',
          description: '',
          active: 1,
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
          live: 1
        },
        {
          name: 'treatment',
          displayName: 'Treatment',
          description: '',
          active: 1,
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
          live: 1
        },

    ]);
  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('services', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
