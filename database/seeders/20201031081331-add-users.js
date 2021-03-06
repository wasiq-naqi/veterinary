'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users', [
        {
          name: 'Super Admin',
          username: 'super.admin',
          image: null,
          emiratesId : '0123456789012344',
          email : 'superadmin@aloropivetcenter.com',
          password : '$2a$10$O0/7pWlUwWzMGTTBhQb2Kei9vYpI8GD2jEvrSjpJbZqwrzmm5XQXy',
          contact : null,
          role : 1,
          remarks : 'System account only for developer',
          active: 1,
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
          live: 1,
        },
        {
          name: 'Administrator',
          username: 'administrator',
          image: null,
          emiratesId : '0123456789012345',
          email : 'admin@aloropivetcenter.com',
          password : '$2a$10$O0/7pWlUwWzMGTTBhQb2Kei9vYpI8GD2jEvrSjpJbZqwrzmm5XQXy',
          contact : null,
          role : 2,
          remarks : 'Admin account for application',
          active: 1,
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
          live: 1,
        },
    ]);
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('users', null, {});

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};