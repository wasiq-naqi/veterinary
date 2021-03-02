const Joi = require('@hapi/joi');
const Service = require('./package.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({
    name: Joi.string().required(),
    active: Joi.boolean().allow('', null),
    description: Joi.string().allow('', null),
    price: Joi.number().required(),
    petTypeId: Joi.number().required(),
    serviceId: Joi.number().required(),
    itemIds: Joi.array().required().items( Joi.number() )
});

exports.GetAll = async (req, res, next) => {

    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;


    let { DB_error, DB_value } = await Service.GetAll(pageNo, pageSize);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.GetEachAndEvery = async (req, res, next) => {


    let { DB_error, DB_value } = await Service.GetEachAndEvery();

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}

exports.GetAllActive = async (req, res, next) => {


    let { DB_error, DB_value } = await Service.GetAllActive();

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}

exports.Get = async (req, res, next) => {
    
    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { DB_error, DB_value } = await Service.Get(req.params.id);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.Create = async (req, res, next) => {

    if(req.file){
        req.body['image'] = req.file.newFile;
    }

    let {error, value} = Schema.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    value.createdBy = req.token.id;
    value.updatedBy = null;

    let { DB_error, DB_value } = await Service.Create(value);

    if(DB_error){

        return Errors(res, DB_error);

    }
    

    return res.status(201).send(DB_value);

}

exports.Update = async (req, res, next) => {

    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    if(req.file){
        req.body['image'] = req.file.newFile;
    }
    
    let {error, value} = Schema.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    value.updatedBy = req.token.id;

    let { DB_error, DB_value } = await Service.Update( value, req.params.id );

    if(DB_error){

        return Errors(res, DB_error);
        
    }

    return res.send(DB_value);

}

exports.Delete = async (req, res, next) => {
    
    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { DB_error, DB_value } = await Service.Delete(req.params.id);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}