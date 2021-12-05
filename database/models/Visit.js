
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Visit', {
      
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
      date:{
        type: Datatypes.DATEONLY,
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
      tableName: 'visits'
    });
}