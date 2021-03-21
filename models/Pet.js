
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
      color : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      pet : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      description : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      gender : {
        type: Datatypes.STRING(),
        allowNull: true,
      },
      age : {
        type: Datatypes.INTEGER(),
        allowNull: true,
      },
      dob : {
        type: Datatypes.DATE(),
        allowNull: true,
      },
      patientId : {
        type: Datatypes.INTEGER(11),
        allowNull: false,
      },
      petTypeId : {
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
      tableName: 'pets'
    });
}