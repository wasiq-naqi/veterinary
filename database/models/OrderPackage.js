
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('OrderPackage', {
      id : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      orderId:{
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      packageId : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      packagePrice : {
        type: Datatypes.FLOAT,
        allowNull: false,
      },
      price:{
        type: Datatypes.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Datatypes.INTEGER(11),
        defaultValue: 0,
        allowNull: false
      },
      quantity:{
        type: Datatypes.INTEGER(11),
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
    }
    ,{ 
      tableName: 'order_packages'
    });
}