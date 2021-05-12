const Joi = require('@hapi/joi');
const PatientService = require('./patient.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({
    image: Joi.string().allow(null, ''),
    emiratesId: Joi.string().allow('', null),
    name: Joi.string().required(),
    email: Joi.string().email().allow('', null),
    gender: Joi.string().allow('', null),
    contact: Joi.string().required(),
    dob: Joi.date().iso().allow('', null),
    address: Joi.string().allow('', null),
});

exports.GetAll = async (req, res) => {

    let { pageNo, pageSize, search, date, appointment } = req.query;
    
    let { DB_error, DB_value } = await PatientService.GetAll(pageNo, pageSize, search);

    if(DB_error){

        return Errors(res, DB_error);

    }
    
    return res.send(DB_value);

}

exports.GetEachAndEvery = async (req, res) => {


    let { DB_error, DB_value } = await PatientService.GetEachAndEvery();

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}

exports.GetAllActive = async (req, res) => {


    let { DB_error, DB_value } = await PatientService.GetAllActive();

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}

exports.Get = async (req, res) => {
    
    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { DB_error, DB_value } = await PatientService.Get(req.params.id);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.Create = async (req, res) => {

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

    let { DB_error, DB_value } = await PatientService.Create(value);

    if(DB_error){

        return Errors(res, DB_error);

    }
    

    return res.status(201).send(DB_value);

}

exports.Update = async (req, res) => {

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

    let { DB_error, DB_value } = await PatientService.Update( value, req.params.id );

    if(DB_error){

        return Errors(res, DB_error);
        
    }

    return res.send(DB_value);

}

exports.Delete = async (req, res) => {
    
    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { DB_error, DB_value } = await PatientService.Delete(req.params.id);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}