let config = require('../config')();

module.exports = {
  development: {
    username: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.DATABASE,
    host: config.DB_HOST,
    port: config.DB.PORT,
    dialect: config.DB.DIALECT,
    "operatorsAliases": 0
  },
  staging: {
    username: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.DATABASE,
    host: config.DB.HOST,
    port: config.DB.PORT,
    dialect: config.DB.DIALECT,
    "operatorsAliases": 0
  },
  production: {
    username: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.DATABASE,
    host: config.DB.HOST,
    port: config.DB.PORT,
    dialect: config.DB.DIALECT,
    "operatorsAliases": 0
  }
};