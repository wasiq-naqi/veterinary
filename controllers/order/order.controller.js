const Joi = require('@hapi/joi');
const Service = require('./order.service');
const { Errors } = require('../../functions');

let item = Joi.object().keys({
    item: Joi.string().required(),
    price: Joi.number().required(),
    serviceId: Joi.number().required(),
});

const Schema = Joi.object({

    patientId: Joi.number().required(),
    // price: Joi.number().required(),
    appointment: Joi.boolean().required(),
    description: Joi.string().required(),
    // serviceId: Joi.number().required(),
    details: Joi.array().required().items(item),

});

let SchemaStatus = Joi.object({
    status: Joi.string().required().valid('placed', 'confirmed')
});

let SchemaGetOrderStatus = Joi.object({
    patientEmiratesId: Joi.string().required(),
    toothId: Joi.number().required(),
    serviceId: Joi.number().required()
});

exports.GetAll = async (req, res, next) => {
    

    let { pageNo, pageSize, search, date, appointment } = req.query;

    let { DB_error, DB_value } = await Service.getAllUsers(
        pageNo, pageSize, 
        {userId: req.token.id, roleId: req.token.role.id}, 
        search, date, appointment);

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


    let { DB_error, DB_value } = await Service.Get(req.params.id, {userId: req.token.id, roleId: req.token.role.id, labId: req.token.labId});

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

    let { DB_error, DB_value } = await Service.Create(value);

    if(DB_error)return Errors(res, DB_error);
    return res.status(201).send(DB_value);

}

exports.Update = async (req, res, next) => {

    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let schema = Schema.keys({
        patientId: Joi.number().required(),
    });

    let {error, value} = schema.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    value.updatedBy = req.token.id;
    
    let { DB_error, DB_value } = await Service.Update( value, req.params.id, {userId: req.token.id, roleId: req.token.role.id, labId: req.token.labId} );

    if(DB_error){

        return Errors(res, DB_error);
        
    }

    return res.send(DB_value);

}

exports.UpdateStatus = async (req, res, next) => {

    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let {error, value} = SchemaStatus.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    value.updatedBy = req.token.id;

    let { DB_error, DB_value } = await Service.UpdateStatus( value, req.params.id );

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

    let value = {};
    value.updatedBy = req.token.id;

    let { DB_error, DB_value } = await Service.Delete( value, req.params.id );

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.GetOrderStatus = async (req, res, next) => {


    let {error, value} = SchemaGetOrderStatus.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }


    let { DB_error, DB_value } = await Service.GetOrderStatus(value);

    if(DB_error){

        return Errors(res, DB_error);

    }
    

    return res.status(201).send(DB_value);

}

exports.GetOrdersByPatient = async (req, res, next) => {
    
    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { search, date, appointment } = req.query;

    let { DB_error, DB_value } = await Service.getOrdersByPatient(
        req.params.id, 
        {userId: req.token.id, roleId: req.token.role.id, labId: req.token.labId},
        date, appointment
        );

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}

exports.GetOrdersByPet = async (req, res, next) => {
    
    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let { date, appointment } = req.query;

    let { DB_error, DB_value } = await Service.getOrdersByPet(
        req.params.id, 
        {userId: req.token.id, roleId: req.token.role.id, labId: req.token.labId},
        date, appointment
        );

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}