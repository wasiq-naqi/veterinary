
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Notification', {
      id : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      patientId:{
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      orderId:{
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      doctorId:{
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      date:{
        type: Datatypes.DATE,
        allowNull: false,
      },
      isRead:{
        type: Datatypes.BOOLEAN,
        defaultValue: false,
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
      tableName: 'notifications'
    });
}