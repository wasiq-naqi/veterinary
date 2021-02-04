
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('OrderBreakdown', {
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
      item : {
        type: Datatypes.STRING(),
        allowNull: true,
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
      tableName: 'order_breakdown'
    });
}