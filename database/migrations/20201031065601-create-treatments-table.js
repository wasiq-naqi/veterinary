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
    image: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    orderId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: { model: 'orders', key: 'id' }
    },
    petId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: { model: 'pets', key: 'id' }
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
    followUp:{
      type: Sequelize.DATE,
      allowNull: true,
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
      references: { model: 'users', key: 'id' }
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
