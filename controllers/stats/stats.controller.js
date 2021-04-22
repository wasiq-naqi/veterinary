const Joi = require('@hapi/joi');
const Service = require('./stats.service');
const { Errors } = require('../../functions');

exports.getEntitiesCount = async (req, res, next) => {
    

    let { DB_error, DB_value } = await Service.getEntitiesCount( );

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}