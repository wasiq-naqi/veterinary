var db = require('../../models');
const { Pagination } = require('../../functions');

let modelName = 'Package';

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
            {
                model: db.PackageItem,
                as: 'PackageItems',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        model: db.Item,
                        as: 'Item',
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    }
                ]
            }
        ],
        subQuery: false,
        distinct: true,
        where
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Package, association);

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

    let Response = await db.Package.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        subQuery: false,
        distinct: true,
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

    let PonticDesign = await db.Package.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        subQuery: false,
        distinct: true,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: PonticDesign
    };
}

exports.Get = async function ( _ID ) {

    let Instance = await db.Package.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        },
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
            {
                model: db.PackageItem,
                as: 'PackageItems',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        model: db.Item,
                        as: 'Item',
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    }
                ]
            }
        ]
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

    let items = {};

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

    for( let item of _OBJECT.itemIds ){

        let itemInstance = await db.Item.findOne({ where: { id: item, live: true }});
        if(!itemInstance){

            let error = new Error(`Item not found having Id ${item}`);
            error.status = 404;
            return {
                DB_error: error
            };
    
        }

        items[item] = itemInstance.dataValues

    }

    let result = await db.Package.create(_OBJECT);

    for( let item of _OBJECT.itemIds ){

        await db.PackageItem.create({
            packageId: result.dataValues.id,
            itemId: item,
            price: items[item].price
        });

    }


    let Instance = await db.Package.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: result.dataValues.id,
            live: true
        },
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
            {
                model: db.PackageItem,
                as: 'PackageItems',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        model: db.Item,
                        as: 'Item',
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    }
                ]
            }
        ]
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

exports.Update = async (_OBJECT, _ID) => {

    let items = {};
    let itemsToDelete = [];

    let Instance = await db.Package.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        },
        include: [
            {
                model: db.PackageItem,
                as: 'PackageItems',
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        model: db.Item,
                        as: 'Item',
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    }
                ]
            }
        ],
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

    for( let item of _OBJECT.itemIds ){

        let itemInstance = await db.Item.findOne({ where: { id: item, live: true }});
        if(!itemInstance){

            let error = new Error(`Item not found having Id ${item}`);
            error.status = 404;
            return {
                DB_error: error
            };
    
        }

        items[item] = itemInstance.dataValues

    }

    // Check for deleted items
    let CurrentPackage = Instance.get({ plain: true });
    for( let item of CurrentPackage.PackageItems ){
        if( !_OBJECT.itemIds.includes(item.itemId) ) itemsToDelete.push(item.id);
    }

    try{

        let result = await Instance.update( _OBJECT );

        // Destroying items
        await db.PackageItem.destroy({ where: { id: { [db.Sequelize.Op.in]: itemsToDelete } } });

        for( let item of _OBJECT.itemIds ){

            // Reassigning new items
            await db.PackageItem.findOrCreate({
                where: {
                    packageId: _ID,
                    itemId: item
                },
                defaults: {
                    packageId: _ID,
                    itemId: item,
                    price: items[item].price
                }
            });
    
        }

        let Instance2 = await db.Package.findOne({
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                id: result.dataValues.id,
                live: true
            },
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
                {
                    model: db.PackageItem,
                    as: 'PackageItems',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    include: [
                        {
                            model: db.Item,
                            as: 'Item',
                            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                        }
                    ]
                }
            ]
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

    let Instance = await db.Package.findOne({
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