'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'roles', [
      {
        name: 'superman',
        displayName: 'Superman',
        description: 'Admin role for the dev user',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        name: 'administrator',
        displayName: 'Administrator',
        description: 'Admin role for the application user',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        name: 'doctor',
        displayName: 'Doctor',
        description: 'Doctor role for the application user',
        active: 1,
        createdBy: 1,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: new Date(),
        live: 1
      },
      {
        name: 'receptionist',
        displayName: 'Receptionist',
        description: 'Receptionist role for the application user',
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

    return queryInterface.bulkDelete('roles', null, {});

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
