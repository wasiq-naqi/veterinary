const Joi = require('@hapi/joi');
const Service = require('./order.service');
const { Errors } = require('../../functions');

const Schema = Joi.object({

    patientId: Joi.number().required(),
    appointment: Joi.boolean().required(),
    checkUpPrice: Joi.number().required().allow(0),
    description: Joi.string().required(),
    assignTo: Joi.number().required().min(1).allow(null),
    // itemIds: Joi.array().required().items( Joi.number() ),
    // packageIds: Joi.array().required().items( Joi.number() ),

    items: Joi.array().required().items( Joi.object({
        itemId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        discount: Joi.number().min(0).max(100).required(),
    }) ),
    packages: Joi.array().required().items( Joi.object({
        packageId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        discount: Joi.number().min(0).max(100).required(),
    }) ),

    followUp: Joi.boolean().required()
    
});

const SchemaUpdate = Joi.object({

    items: Joi.array().required().items( Joi.object({
        id: Joi.number().min(1),
        itemId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        discount: Joi.number().min(0).max(100).required(),
    }) ),
    packages: Joi.array().required().items( Joi.object({
        id: Joi.number().min(1),
        packageId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        discount: Joi.number().min(0).max(100).required(),
    }) ),
    
});

let SchemaStatus = Joi.object({
    status: Joi.string().required().valid('placed', 'confirmed')
});

let SchemaDoctor = Joi.object({
    assignTo: Joi.number().required().min(1).allow(null),
});

let SchemaGetOrderStatus = Joi.object({
    patientEmiratesId: Joi.string().required(),
    toothId: Joi.number().required(),
    serviceId: Joi.number().required()
});

exports.GetAll = async (req, res, next) => {
    

    let { pageNo, pageSize, search, date, appointment, checkUp, fromDate, toDate, assignTo } = req.query;

    let { DB_error, DB_value } = await Service.getAllUsers({
        pageNo,
        pageSize,
        fromDate,
        toDate,
        user: { userId: req.token.id, roleId: req.token.role.id },
        search,
        date,
        appointment,
        checkUp,
        assignTo
    });

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

    let {error, value} = SchemaUpdate.validate(req.body);

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

exports.UpdateDoctor = async (req, res, next) => {

    if( isNaN(req.params.id) ){
        let error = new Error('ID must be a number');
        error.status = 400;
        return Errors(res, error);
    }

    let {error, value} = SchemaDoctor.validate(req.body);

    if(error){

        let newError = {
            message: error.details[0].message,
            status: 400
        }

        return Errors(res, newError);

    }

    value.updatedBy = req.token.id;

    let { DB_error, DB_value } = await Service.UpdateDoctor( value, req.params.id );

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

    let { date, appointment, checkUp } = req.query;

    let { DB_error, DB_value } = await Service.getOrdersByPatient(
        req.params.id, 
        {userId: req.token.id, roleId: req.token.role.id, labId: req.token.labId},
        date, appointment, checkUp
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

    let { date, appointment, checkUp } = req.query;

    let { DB_error, DB_value } = await Service.getOrdersByPet(
        req.params.id, 
        {userId: req.token.id, roleId: req.token.role.id, labId: req.token.labId},
        date, appointment, checkUp
        );

    if(DB_error){

        return Errors(res, DB_error);

    }

    return res.send(DB_value);

}