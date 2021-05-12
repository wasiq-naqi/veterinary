
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Patient', {
      id : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      image: {
        type: Datatypes.STRING(500),
        allowNull: true,
      },
      emiratesId : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      name : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      email : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      gender : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      contact : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      dob : {
        type: Datatypes.DATE(),
        allowNull: true,
      },
      address : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      noOrder: {
        type: Datatypes.BOOLEAN(),
        allowNull: true,
        defaultValue: true,
      },
      createdBy: {
        type: Datatypes.INTEGER(11),
        allowNull: true,
      },
      updatedBy: {
        type: Datatypes.INTEGER(11),
        allowNull: true,
      },
      live: {
        type: Datatypes.BOOLEAN,
        allowNull: false,
        defaultValue: true    
      }
    },{ 
      tableName: 'patients'
    });
}