'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// LOADING THE ENVIORMENT VARIABLES
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, { 
  host: process.env.DB_HOST, 
  dialect: 'mariadb',
  logging: false,
  timezone: '+05:00', //fron writing into database
  // dialectOptions: {
  //   // useUTC: false, //for reading from database
  //   timezone: "+05:00"
  // },
  // timezone: 'Asia/Karachi'
});


sequelize.authenticate()
.then(()=>{ 

    console.log('[DATABASE] Connection successfull.');
    
    fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js' && file != 'index.js');
    })
    .forEach(file => {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    // Associations
    db.User.belongsTo(db.Role, {foreignKey: 'role'});
    

    db.Pet.belongsTo(db.Patient, { foreignKey: 'patientId'});
    db.Patient.hasMany(db.Pet, { as: 'Pets', foreignKey: 'patientId'});

    db.OrderItem.belongsTo(db.Item, { as: 'Item', foreignKey: 'itemId'});
    db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId'});
    db.Order.hasMany(db.OrderItem, { as: 'Items', foreignKey: 'orderId'});

    db.OrderPackage.belongsTo(db.Package, { foreignKey: 'packageId'});
    db.OrderPackage.belongsTo(db.Order, { foreignKey: 'orderId'});
    db.Order.hasMany(db.OrderPackage, { as: 'Packages', foreignKey: 'orderId'});
    
    // db.Order.belongsTo(db.Service, { foreignKey: 'serviceId'});
    db.Order.belongsTo(db.Patient, { foreignKey: 'patientId'});

    db.Order.hasMany(db.Treatment, { as: 'Treatments', foreignKey: 'orderId'});

    db.Treatment.belongsTo(db.Order, { foreignKey: 'orderId'});
    db.Treatment.belongsTo(db.User, { as: 'Doctor', foreignKey: 'createdBy'});
    db.Treatment.belongsTo(db.Pet, { as: 'Pet', foreignKey: 'petId'});

    // db.Treatment.belongsTo(db.TreatmentRecomendationItem,  { as: '', foreignKey: 'treatmentId'});
    db.Treatment.hasMany(db.TreatmentRecomendationItem , { as: 'Recomendations', foreignKey: 'treatmentId'} );
    db.TreatmentRecomendationItem.belongsTo(db.Item, { as: 'Item', foreignKey: 'itemId' });


    db.Item.belongsTo(db.PetType, { as: 'PetType', foreignKey: 'petTypeId'});
    db.Item.belongsTo(db.Service, { as: 'Service', foreignKey: 'serviceId'});

    db.Package.belongsTo(db.PetType, { as: 'PetType', foreignKey: 'petTypeId'});
    db.Package.belongsTo(db.Service, { as: 'Service', foreignKey: 'serviceId'});
    db.Package.hasMany( db.PackageItem , { as: 'PackageItems', foreignKey: 'packageId'} );

    db.PackageItem.belongsTo( db.Item, { as: 'Item', foreignKey: 'itemId' }) ;

    // Synchronization
    sequelize.sync()
    .then(() => {
        console.log('[DATABASE] Synchronising successfull');
    })
    .catch((error) => {  
        console.log('[DATABASE] Synchronising failed\n Error =>', error);
    });

})
.catch(( error )=>{ console.log('[DATABASE] Connection failed', error); })


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
