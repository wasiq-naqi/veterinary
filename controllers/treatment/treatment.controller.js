const Joi = require('@hapi/joi');
const TreatmentService = require('./treatment.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({
    orderId: Joi.number().required(),
    petId: Joi.number().required(),
    statement: Joi.string().required(),
    prescription: Joi.string().required(),
    description: Joi.string().allow('', null),
    recomendations: Joi.array().required().items( Joi.number() ),
    followUp: Joi.date().iso().allow('', null)
});

const SchemaTreatmentsByPetsId = Joi.object({
    petId: Joi.number().required()
});

exports.GetAll = async (req, res) => {

    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;


    let { DB_error, DB_value } = await TreatmentService.GetAll(pageNo, pageSize);

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

    let { DB_error, DB_value } = await TreatmentService.Get(req.params.id);

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

    let { DB_error, DB_value } = await TreatmentService.Create(value);

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

    let { DB_error, DB_value } = await TreatmentService.Update( value, req.params.id );

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

    let { DB_error, DB_value } = await TreatmentService.Delete(req.params.id);

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.TreatmentsByPetsId = async (req, res) => {

    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;

    let { value, error } = SchemaTreatmentsByPetsId.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    let { DB_error, DB_value } = await TreatmentService.GetTreatmentsByPetsId( value, pageNo, pageSize );

    if(DB_error) return Errors(res, DB_error); 
    return res.send(DB_value);

}