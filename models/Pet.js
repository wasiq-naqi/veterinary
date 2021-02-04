
module.exports = (sequelize, Datatypes) => {
    return sequelize.define('Pet', {
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
      name : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      description : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      gender : {
        type: Datatypes.STRING(),
        allowNull: false,
      },
      dob : {
        type: Datatypes.DATE(),
        allowNull: false,
      },
      patientId : {
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
    },{ 
      tableName: 'pets'
    });
}