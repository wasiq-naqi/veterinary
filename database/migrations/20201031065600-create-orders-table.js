'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.createTable('orders', { 
    id : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    patientId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: { model: 'patients', key: 'id' }
    },
    description : {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    appointment:{
      type: Sequelize.STRING(),
      allowNull: false,
    },
    checkUpPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    followUp:{
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    assignTo: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    createdBy: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: { model: 'users', key: 'id' }
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

  down: (queryInterface) => {

    return queryInterface.dropTable('orders');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
