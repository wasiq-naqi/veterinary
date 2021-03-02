
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Package', {
      id : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      description: {
        type: Datatypes.STRING(),
        allowNull: true
      },
      active : {
        type: Datatypes.BOOLEAN(),
        allowNull: true,
        defaultValue: true,
      },
      price: {
        type: Datatypes.INTEGER(11),
        allowNull: false
      },
      petTypeId : {
        type: Datatypes.INTEGER(11),
        allowNull: false
      },
      serviceId : {
        type: Datatypes.INTEGER(11),
        allowNull: false
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
      tableName: 'packages'
    });
}