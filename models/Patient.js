
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Patient', {
      id : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      emiratesId : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      name : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      gender : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      contact : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      dob : {
        type: Datatypes.DATE(),
        allowNull: false,
      },
      address : {
        type: Datatypes.STRING(),
        allowNull: false,
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