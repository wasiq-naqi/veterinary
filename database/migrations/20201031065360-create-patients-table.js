'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.createTable('patients', { 
    id : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    image: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    emiratesId : {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    name : {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    email : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    gender : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    contact : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    dob : {
      type: Sequelize.DATE(),
      allowNull: false,
    },
    address : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    noOrder: {
      type: Sequelize.BOOLEAN(),
      allowNull: true,
      defaultValue: true,
    },
    lastVisitAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    updatedBy: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate : Sequelize.NOW,
      allowNull: false,
    },
    live: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },{
    timestamp: true,
    updatedAt: 'updateTimestamp'
  });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('patients');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
