
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('OrderItem', {
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
      itemId : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      price:{
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
      tableName: 'order_items'
    });
}