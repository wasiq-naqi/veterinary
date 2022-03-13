
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Treatment', {
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
      orderId:{
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      petId:{
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      statement:{
        type: Datatypes.STRING(),
        allowNull: true,
      },
      prescription:{
        type: Datatypes.STRING(),
        allowNull: true,
      },
      description:{
        type: Datatypes.STRING(),
        allowNull: true,
      },
      followUp:{
        type: Datatypes.DATE,
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
    }
    ,{ 
      tableName: 'treatments'
    });
}