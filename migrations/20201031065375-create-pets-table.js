'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.createTable('pets', { 
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
    name : {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    color : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    pet : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    description : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    gender : {
      type: Sequelize.STRING(),
      allowNull: true,
    },
    age : {
      type: Sequelize.INTEGER(),
      allowNull: true,
    },
    dob : {
      type: Sequelize.DATE(),
      allowNull: true,
    },
    patientId : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    petTypeId : {
      type: Sequelize.INTEGER(11),
      allowNull: true,
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

    return queryInterface.dropTable('pets');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
