'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// LOADING THE ENVIORMENT VARIABLES
const config = require('../../config')();

// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.DB.DATABASE, config.DB.USER, config.DB.PASSWORD, { 
  host: config.DB.HOST, 
  dialect: config.DB.DIALECT,
  logging: false,
  // timezone: '+04:00', //fro writing into database
  dialectOptions: {
    // useUTC: false, //for reading from database
    // timezone: "+04:00",
    // typeCast: function (field, next) { // for reading from database
    //   if (field.type === 'DATETIME') {
    //     return field.string()
    //   }
    //     return next()
    // },
  },
  // timezone: 'Asia/Karachi'
});

(async function(){
  
  sequelize.authenticate()
  .then(() =>{
    console.log('[DATABASE] Connection successfull.');

    // Synchronization
    sequelize.sync()
    .then(() => {
        console.log('[DATABASE] Synchronising successfull');
    })
    .catch((error) => {  
        console.log('[DATABASE] Synchronising failed\n Error =>', error);
    });

  })
  .catch((Excp) =>{
    console.log('[DATABASE] Connection failed', Excp.message);
  });

})()

// Including models
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
db.Order.belongsTo(db.User, { as: 'AssignTo', foreignKey: 'assignTo'});

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

db.Notification.belongsTo(db.Patient, { as: 'Patient', foreignKey: 'patientId'});


// 
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
