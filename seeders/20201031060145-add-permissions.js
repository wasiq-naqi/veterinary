'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
    'permissions',[

      // Adding Users permissions
      {
        resourceId: 1,
        actionId: 1,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 1,
        actionId: 2,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 1,
        actionId: 3,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 1,
        actionId: 4,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 1,
        actionId: 5,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

      // Adding roles
      {
        resourceId: 2,
        actionId: 1,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 2,
        actionId: 2,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 2,
        actionId: 3,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 2,
        actionId: 4,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 2,
        actionId: 5,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

      // services 
      {
        resourceId: 3,
        actionId: 1,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 3,
        actionId: 2,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 3,
        actionId: 3,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 3,
        actionId: 4,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 3,
        actionId: 5,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

      // orders
      {
        resourceId: 4,
        actionId: 1,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 4,
        actionId: 2,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 4,
        actionId: 3,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 4,
        actionId: 4,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 4,
        actionId: 5,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },

      // patients
      {
        resourceId: 5,
        actionId: 1,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 5,
        actionId: 2,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 5,
        actionId: 3,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 5,
        actionId: 4,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        resourceId: 5,
        actionId: 5,
        description: 'Description',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('permissions', null, {});

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
