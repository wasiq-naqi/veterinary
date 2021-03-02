var db = require('../../models');
const { Pagination } = require('../../functions');

let modelName = 'Item';

exports.GetAll = async function ( _PAGE, _LIMIT) {

    let association = {
        where: {
            live: true
        }
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Item, association);

    return {
        DB_value: result
    };

}

exports.GetEachAndEvery = async function () {
    
    let Response = await db.Item.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            live: true
        },
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Response
    };
}

exports.GetAllActive = async function () {
    
    let PonticDesign = await db.Item.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            live: true,
            active: true
        },
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: PonticDesign
    };
}

exports.Get = async function ( _ID ) {

    let Instance = await db.Item.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Instance){

        let error = new Error(modelName + " not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: Instance
    };

}

exports.Create = async (_OBJECT) => {

    let Service = await db.Service.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.serviceId,
            live: true
        }
    });


    if(!Service){

        let error = new Error("Service not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let PetType = await db.PetType.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.petTypeId,
            live: true
        }
    });


    if(!PetType){

        let error = new Error("Pet type not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let result = await db.Item.create(_OBJECT);

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID) => {

    let Instance = await db.Item.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        }
    });

    if(!Instance){

        let error = new Error( modelName + " not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let Service = await db.Service.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.serviceId,
            live: true
        }
    });


    if(!Service){

        let error = new Error("Service not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let PetType = await db.PetType.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.petTypeId,
            live: true
        }
    });


    if(!PetType){

        let error = new Error("Pet type not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    try{

        let result = await Instance.update( _OBJECT );

        delete result.dataValues.createdBy;
        delete result.dataValues.updatedBy;
        delete result.dataValues.updatedAt;
        delete result.dataValues.live;

        return {
            DB_value: result
        };

    }
    catch( Excp ){

        console.log(Excp);

        let error = new Error("");
        error.status = 500;
        return {
            DB_error: error
        };

    }

}

exports.Delete = async ( _ID ) => {

    let Instance = await db.Item.findOne({
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Instance){

        let error = new Error( modelName + " not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    Instance.live = false;
    let result = await Instance.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };

}