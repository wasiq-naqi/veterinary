'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.createTable('order_packages', { 
    id : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    orderId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: { model: 'orders', key: 'id' }
    },
    packageId : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: { model: 'packages', key: 'id' }
    },
    packagePrice : {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    price:{
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    discount: {
      type: Sequelize.INTEGER(11),
      defaultValue: 0,
      allowNull: false
    },
    quantity:{
      type: Sequelize.INTEGER(11),
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

    return queryInterface.dropTable('order_packages');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
