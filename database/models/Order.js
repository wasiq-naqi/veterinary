
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Order', {
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
      description : {
        type: Datatypes.STRING(500),
        allowNull: true,
      },
      appointment:{
        type: Datatypes.STRING(),
        allowNull: false,
      },
      checkUpPrice: {
        type: Datatypes.FLOAT(11),
        allowNull: false,
      },
      checkupDone:{
        type: Datatypes.BOOLEAN,
        allowNull: true,
        default: false,
      },
      price: {
        type: Datatypes.FLOAT,
        allowNull: false,
      },
      followUp:{
        type: Datatypes.BOOLEAN,
        allowNull: false
      },
      assignTo: {
        type: Datatypes.INTEGER(11),
        allowNull: true,
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
      tableName: 'orders'
    });
}