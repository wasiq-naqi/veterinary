const Joi = require('@hapi/joi');
const RoleService = require('./role.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({
    name: Joi.string().required(),
    displayName: Joi.string().required(),
    active: Joi.boolean().required(),
    description: Joi.string().allow('', null)
});

exports.GetAll = async (req, res, next) => {
    
    let { pageNo, pageSize, search } = req.query;

    let { DB_error, DB_value } = await RoleService.GetAll(pageNo, pageSize, req.token, search);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.GetEachAndEvery = async (req, res, next) => {

    let { search } = req.query;

    let { DB_error, DB_value } = await RoleService.GetEachAndEvery( req.token, search );

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}

exports.GetAllActive = async (req, res, next) => {

    let { search } = req.query;

    let { DB_error, DB_value } = await RoleService.GetAllActive( req.token, search );

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

    let { DB_error, DB_value } = await RoleService.Get(req.params.id, req.token);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.Create = async (req, res, next) => {

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
        // _OBJECT.createdBy = 1;
        // _OBJECT.updatedBy = 1;

        let { DB_error, DB_value } = await RoleService.Create(value);

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

    let {error, value} = Schema.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    value.updatedBy = req.token.id;

    let { DB_error, DB_value } = await RoleService.Update( value, req.params.id, req.token );

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

    let { DB_error, DB_value } = await RoleService.Delete(req.params.id, req.token);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}
