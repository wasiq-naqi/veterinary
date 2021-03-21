const Joi = require('@hapi/joi');
const PetService = require('./pet.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({
    image: Joi.string().allow(null, ''),
    name: Joi.string().required(),
    pet: Joi.string().allow('', null),
    color: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    gender: Joi.string().allow('', null),
    age: Joi.number().allow('', null),
    dob: Joi.date().allow('', null),
    patientId: Joi.number().required(),
    petTypeId: Joi.number().allow('', null),
});

const PatientPetsSchema = Joi.object({
    patientId: Joi.number().required(),
});

exports.GetAll = async (req, res) => {

    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;


    let { DB_error, DB_value } = await PetService.GetAll(pageNo, pageSize);

    if(DB_error){

        return Errors(res, DB_error);

    }
    
    return res.send(DB_value);

}

exports.GetEachAndEvery = async (req, res) => {


    let { DB_error, DB_value } = await PetService.GetEachAndEvery();

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);
}

exports.GetAllActive = async (req, res) => {


    let { DB_error, DB_value } = await PetService.GetAllActive();

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

    let { DB_error, DB_value } = await PetService.Get(req.params.id);

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

    let { DB_error, DB_value } = await PetService.Create(value);

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

    let { DB_error, DB_value } = await PetService.Update( value, req.params.id );

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

    let { DB_error, DB_value } = await PetService.Delete(req.params.id);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}


exports.GetPetsByPatientId = async (req, res) => {

    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;

    let { value, error } = PatientPetsSchema.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    let { DB_error, DB_value } = await PetService.GetPetsByPatientId( value, pageNo, pageSize );

    if(DB_error) return Errors(res, DB_error); 
    return res.send(DB_value);

}