const Joi = require('@hapi/joi');
const Service = require('./notification.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({
    name: Joi.string().required(),
    active: Joi.boolean().required(),
    description: Joi.string().allow('', null)
});

exports.GetAll = async (req, res, next) => {

    let { pageNo, pageSize, date } = req.query;

    let { DB_error, DB_value } = await Service.GetAll(pageNo, pageSize, date);

    if(DB_error){
        return Errors(res, DB_error);
    }

    return res.send(DB_value);
}

exports.GetEachAndEvery = async (req, res, next) => {

    let { date } = req.query;

    let { DB_error, DB_value } = await Service.GetEachAndEvery( date );

    if(DB_error){
        return Errors(res, DB_error);
    }

    return res.send(DB_value);
    
}

exports.MakeReadSingle = async (req, res, next) => {

    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { DB_error, DB_value } = await Service.MakeReadSingle( req.params.id );

    if(DB_error){
        return Errors(res, DB_error);
    }

    return res.send(DB_value);
    
}

