'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
    'resources',
    [
      {
        name: 'Users',
        description: 'This is a resource for user management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        name: 'Roles',
        description: 'This is a resource for role management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      // Patient - 3
      {
        name: 'Patients',
        description: 'This is a resource for order management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        name: 'Services',
        description: 'This is a resource for service management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        name: 'Orders',
        description: 'This is a resource for order management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

      // Pets - 6
      {
        name: 'Pets',
        description: 'This is a resource for order management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

      // Pets - 7
      {
        name: 'Treatments',
        description: 'This is a resource for order management',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

    ])
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('resources', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
