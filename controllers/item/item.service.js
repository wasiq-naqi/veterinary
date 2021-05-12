var db = require('../../database/models');
const { Pagination } = require('../../functions');

let modelName = 'Item';

exports.GetAll = async function ( _PAGE, _LIMIT, { petTypeId, serviceId, active, search }) {

    let where = {
        live: true
    }

    if(search){

        // search = ( search == 'true' || search == 'false' )? ( search == 'true' ? 1 : 0 ) : search;
        let searchOf = `%${search}%`;

        // console.log('Search:', search);

        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            { active: { [db.Sequelize.Op.like]: searchOf } },
            { price: { [db.Sequelize.Op.like]: searchOf } },

            { name: db.Sequelize.where(db.Sequelize.col('PetType.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Service.name'), { [db.Sequelize.Op.like]: searchOf  }) },

        ]

    }

    // Matching Active State
    if( active ){

        active = ( active == 'true' || active == 'false' ) ? ( active == 'true' ? 1 : 0 ) : active;

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { active: { [db.Sequelize.Op.eq]: active } } );

    }

    // Matching Service
    if( serviceId ){

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { serviceId: { [db.Sequelize.Op.eq]: serviceId } } );

    }

    // Matching PetType
    if( petTypeId ){

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { petTypeId: { [db.Sequelize.Op.eq]: petTypeId } } );

    }

    let association = {
        include: [
            {
                model: db.PetType,
                as: 'PetType',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                model: db.Service,
                as: 'Service',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
        ],
        where
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Item, association);

    return {
        DB_value: result
    };

}

exports.GetEachAndEvery = async function ({ petTypeId, serviceId, active, search }) {
    
    let where = {
        live: true
    }

    if(search){

        // search = ( search == 'true' || search == 'false' )? ( search == 'true' ? 1 : 0 ) : search;
        let searchOf = `%${search}%`;

        // console.log('Search:', search);

        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            { active: { [db.Sequelize.Op.like]: searchOf } },
            { price: { [db.Sequelize.Op.like]: searchOf } },

            { name: db.Sequelize.where(db.Sequelize.col('PetType.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Service.name'), { [db.Sequelize.Op.like]: searchOf  }) },

        ]

    }

    // Matching Active State
    if( active ){

        active = ( active == 'true' || active == 'false' ) ? ( active == 'true' ? 1 : 0 ) : active;

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { active: { [db.Sequelize.Op.eq]: active } } );

    }

    // Matching Service
    if( serviceId ){

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { serviceId: { [db.Sequelize.Op.eq]: serviceId } } );

    }

    // Matching PetType
    if( petTypeId ){

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { petTypeId: { [db.Sequelize.Op.eq]: petTypeId } } );

    }

    let Response = await db.Item.findAll({
        include: [
            {
                model: db.PetType,
                as: 'PetType',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                model: db.Service,
                as: 'Service',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
        ],
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Response
    };
}

exports.GetAllActive = async function ({ petTypeId, serviceId, search }) {
    
    let where = {
        live: true,
        active: true
    }

    if(search){

        // search = ( search == 'true' || search == 'false' )? ( search == 'true' ? 1 : 0 ) : search;
        let searchOf = `%${search}%`;

        // console.log('Search:', search);

        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            // { active: { [db.Sequelize.Op.like]: searchOf } },
            { price: { [db.Sequelize.Op.like]: searchOf } },

            { name: db.Sequelize.where(db.Sequelize.col('PetType.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Service.name'), { [db.Sequelize.Op.like]: searchOf  }) },

        ]

    }

    // Matching Service
    if( serviceId ){

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { serviceId: { [db.Sequelize.Op.eq]: serviceId } } );

    }

    // Matching PetType
    if( petTypeId ){

        if( !where[db.Sequelize.Op.and] ) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push( { petTypeId: { [db.Sequelize.Op.eq]: petTypeId } } );

    }

    let Response = await db.Item.findAll({
        include: [
            {
                model: db.PetType,
                as: 'PetType',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                model: db.Service,
                as: 'Service',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
        ],
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Response
    };
}

exports.Get = async function ( _ID ) {

    let Instance = await db.Item.findOne({
        include: [
            {
                model: db.PetType,
                as: 'PetType',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                model: db.Service,
                as: 'Service',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
        ],
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

    try{

        let result = await db.Item.create(_OBJECT);

        let Instance = await db.Item.findOne({
            include: [
                {
                    model: db.PetType,
                    as: 'PetType',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
            ],
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                id: result.dataValues.id,
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
    catch( Excp ){

        let error = new Error("Database error");
        error.status = 500;
        return {
            DB_error: error
        };

    }
    

    
    
    
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

        let Instance2 = await db.Item.findOne({
            include: [
                {
                    model: db.PetType,
                    as: 'PetType',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
            ],
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                id: result.dataValues.id,
                live: true
            }
        });
       
        if(!Instance2){
    
            let error = new Error(modelName + " not found!");
            error.status = 404;
            return {
                DB_error: error
            };
    
        }
    
        return {
            DB_value: Instance2
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