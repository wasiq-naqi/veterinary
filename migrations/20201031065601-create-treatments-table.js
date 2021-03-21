'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.createTable('treatments', { 
    id : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    orderId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    petId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    statement:{
      type: Sequelize.STRING(),
      allowNull: true,
    },
    prescription:{
      type: Sequelize.STRING(),
      allowNull: true,
    },
    description:{
      type: Sequelize.STRING(),
      allowNull: true,
    },
    recomendation:{
      type: Sequelize.STRING(),
      allowNull: true,
    },
    followUp:{
      type: Sequelize.DATE,
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
      allowNull: false,
      onUpdate: Sequelize.NOW
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

    return queryInterface.dropTable('treatments');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
