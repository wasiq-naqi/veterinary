'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.createTable('visits', { 
    id : {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    patientId:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: { model: 'patients', key: 'id', }
    },
    date:{
      type: Sequelize.DATEONLY,
      allowNull: false,
    },

    createdBy: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: { model: 'users', key: 'id', }
    },
    updatedBy: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: { model: 'users', key: 'id', }
    },
    live: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
      onUpdate: Sequelize.NOW
    },
    
  },{
    timestamp: true,
    updatedAt: 'updateTimestamp'
  });

  },

  down: (queryInterface) => {

    return queryInterface.dropTable('visits');

  }
};
