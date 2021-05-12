
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('PackageItem', {
      id : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      packageId : {
        type: Datatypes.INTEGER(11),
        allowNull: false
      },
      itemId : {
        type: Datatypes.INTEGER(11),
        allowNull: false
      },
      price: {
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
      tableName: 'package_items'
    });
}