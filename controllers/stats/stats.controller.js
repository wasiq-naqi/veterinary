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

exports.getDashboardReport = async (req, res, next) => {
    
    const { fromDate, toDate } = req.body;

    let { DB_error, DB_value } = await Service.getDashboardReport({ fromDate, toDate });

    if(DB_error) return Errors(res, DB_error); 
    return res.send(DB_value);

}