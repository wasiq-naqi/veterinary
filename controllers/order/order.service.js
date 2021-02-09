var db = require('../../models');
const { Pagination } = require('../../functions');
const { Roles } = require('../../utils/permissions');

exports.getAllUsers = async function ( _PAGE, _LIMIT, _USER, _SEARCH, _DATE, _APPOINTMENT ) {
    
    let where = {
        live: true
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            // { patientEmiratesId: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            { appointment: { [db.Sequelize.Op.like]: searchOf } },
            { price: { [db.Sequelize.Op.like]: searchOf } },

            { name: db.Sequelize.where(db.Sequelize.col('Patient.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.gender'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.contact'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.emiratesId'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.address'), { [db.Sequelize.Op.like]: searchOf  }) },

            { name: db.Sequelize.where(db.Sequelize.col('Service.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Service.displayName'), { [db.Sequelize.Op.like]: searchOf  }) },
        ]

    }

    if(_DATE){

        let searchOf = `${_DATE}`;
        // where[db.Sequelize.Op.and]= [
        //     { 
        //         createdAt: searchOf 
        //     },
        // ]
        where[db.Sequelize.Op.and] = sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), searchOf);
    }

    if(_APPOINTMENT){

        let searchOf = `${_APPOINTMENT}`;
        where[db.Sequelize.Op.and]= [
            { 
                appointment: searchOf 
            },
        ]
    }

    let include = [
        {
            as: 'Patient',
            model: db.Patient, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Service',
            model: db.Service, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'OrderBreakdowns',
            model: db.OrderBreakdown, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                live: true
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                live: true
            }
        },
    ]

    let association = {
        include,
        where,
        subQuery: false
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Order, association);

    return {
        DB_value: result
    };
}

exports.Get = async function ( _ID ) {

    let where = {
        live: true,
        id: _ID,
    }

    let include = [
        {
            as: 'Patient',
            model: db.Patient, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Service',
            model: db.Service, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'OrderBreakdowns',
            model: db.OrderBreakdown, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                live: true
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                live: true
            }
        },
    ]

    let Order = await db.Order.findOne({
        where,
        include,
    });


    if(!Order){

        let error = new Error("Order not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    Order = Order.get({ plain: true });

    return {
        DB_value: Order
    };

}

exports.Create = async ( _OBJECT ) => {

        if( _OBJECT.patientId ){

            let Patient = await db.Patient.findOne({
                where: {
                    id: _OBJECT.patientId,
                    live: true
                }
            });
    
            if(!Patient){
    
                let error = new Error(`Patient does not exists having id '${_OBJECT.patientId}'`);
                error.status = 400;
                return {
                    DB_error: error
                }; 
    
            }

        }

        if( _OBJECT.serviceId ){

            let Service = await db.Service.findOne({
                where: {
                    id: _OBJECT.serviceId,
                    live: true
                }
            });
    
            if(!Service){
    
                let error = new Error(`Service does not exists having id '${_OBJECT.serviceId}'`);
                error.status = 400;
                return {
                    DB_error: error
                }; 
    
            }

        }


        // Creating Order
        let orderObject = {
            patientId: _OBJECT.patientId,
            serviceId: _OBJECT.serviceId,
            appointment: _OBJECT.appointment,
            price: _OBJECT.price,
            description: _OBJECT.description,
            createdBy: _OBJECT.createdBy,
        }

        let Order = await db.Order.create(orderObject);

        if(Order){
            for(let item of _OBJECT['details']){

                await db.OrderBreakdown.create({
                    item: item.item,
                    price: item.price,
                    orderId: Order.dataValues.id,
                    createdBy: _OBJECT.createdBy,
                });
                
            }
        }

        return {
            DB_value: _OBJECT
        };
    
    
}

exports.Update = async (_OBJECT, _ID, condition = {}) => {

    let Order = null;
    if( _ID ){

        let where = {
            id: _ID,
            live: true
        }
        
        Order = await db.Order.findOne({
            where
        });

        if(!Order){

            let error = new Error(`Order does not exists having id '${_ID}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    let Patient = null;
    if( _OBJECT.patientId ){

        Patient = await db.Patient.findOne({
            where: {
                id: _OBJECT.patientId,
                live: true
            }
        });

        if(!Patient){

            let error = new Error(`Patient does not exists having id '${_OBJECT.patientId}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    if( _OBJECT.labId ){

        let lab = await db.Lab.findOne({
            where: {
                id: _OBJECT.labId,
                live: true
            }
        });

        if(!lab){

            let error = new Error(`Lab does not exists having id '${_OBJECT.labId}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    if( _OBJECT.shadeId ){

        let Shade = await db.Shade.findOne({
            where: {
                id: _OBJECT.shadeId,
                live: true
            }
        });

        if(!Shade){

            let error = new Error(`Shade does not exists having id '${_OBJECT.shadeId}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    if( _OBJECT.parentId ){

        let parent = await db.Order.findOne({
            where: {
                id: _OBJECT.parentId,
                live: true
            }
        });

        if(!parent){

            let error = new Error(`Order does not exists having id '${_OBJECT.parentId}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    let tooths = _OBJECT.tooths;

    for(let element of tooths){

        let Tooth = await db.Tooth.findOne( {where: {id: element.toothId, live: true } });
        if(!Tooth){
            let error = new Error(`Tooth does not exists having id '${element.toothId}'`);
            error.status = 400;
            return {
                DB_error: error
            };
        }

        let services = element.serviceIds;
        for(let serviceId of services){

            let Service = await db.Service.findOne( {where: {id: serviceId, live: true } });
            if(!Service){
                let error = new Error(`Service does not exists having id '${serviceId}'`);
                error.status = 400;
                return {
                    DB_error: error
                };
            }

        }

        let ponticDesigns = element.ponticDesignIds;
        for(let ponticDesignId of ponticDesigns){

            let PonticDesign = await db.PonticDesign.findOne( {where: {id: ponticDesignId, live: true } });
            if(!PonticDesign){
                let error = new Error(`Pontic Design does not exists having id '${ponticDesignId}'`);
                error.status = 400;
                return {
                    DB_error: error
                };
            }

        }

    }
    
    /*
    **After validating success
    */

    await db.OrderTooth.update({ live: false }, { where: { orderId: _ID } });

    /*
    **After removing current associations
    */

    // Create Patient Object
    // let patientOject = {
    //     name: _OBJECT.patientName,
    //     gender: _OBJECT.patientGender,
    //     contact: _OBJECT.patientContact,
    //     createdBy: _OBJECT.createdBy,
    // }
    Patient.name = _OBJECT.patientName;
    Patient.gender = _OBJECT.patientGender;
    Patient.contact = _OBJECT.patientContact;
    Patient.updatedBy = _OBJECT.updatedBy;
    await Patient.save();

    // Creating Order
    Order.patientEmiratesId = _OBJECT.patientEmiratesId;
    Order.patientId = _OBJECT.patientId;
    Order.sentDate = _OBJECT.sendDate;
    Order.returnDate = _OBJECT.returnDate;
    Order.urgent = _OBJECT.urgent;
    Order.notes = _OBJECT.notes;
    Order.labId = _OBJECT.labId;
    Order.shadeId = _OBJECT.shadeId;
    Order.parentId = _OBJECT.parentId;
    Order.updatedBy = _OBJECT.updatedBy;

    await Order.save();

    // Adding Tooths to Orders
    for(let element of tooths){

        let orderTooth = {
            orderId: _ID,
            toothId: element.toothId,
            createdBy: _OBJECT.createdBy,
        }
        let Tooth = await db.OrderTooth.create(orderTooth);
        if(!Tooth){
            let error = new Error(`Failed to add tooth having id '${element.toothId}' to order`);
            error.status = 500;
            return {
                DB_error: error
            };
        }

        let services = element.serviceIds;
        for(let serviceId of services){

            let orderToothService = {
                orderToothId: Tooth.dataValues.id,
                serviceId: serviceId,
                createdBy: _OBJECT.createdBy,
            }
            let Service = await db.OrderToothService.create(orderToothService);
            if(!Service){
                let error = new Error(`Failed to add service having id '${serviceId}' to order`);
                error.status = 500;
                return {
                    DB_error: error
                };
            }

        }

        let ponticDesigns = element.ponticDesignIds;
        for(let ponticDesignId of ponticDesigns){

            let orderToothPonticDesign = {
                orderToothId: Tooth.dataValues.id,
                ponticDesignId: ponticDesignId,
                createdBy: _OBJECT.createdBy,
            }
            let PonticDesign = await db.OrderToothPonticDesign.create(orderToothPonticDesign);
            if(!PonticDesign){
                let error = new Error(`Failed to add pontic design having id '${ponticDesignId}' to order`);
                error.status = 500;
                return {
                    DB_error: error
                };
            }

        }

    }

    delete _OBJECT.updatedBy;

    return {
        DB_value: _OBJECT
    };


}

exports.UpdateStatus = async (_OBJECT, _ID) => {

    let Order = null;
    if( _ID ){

        Order = await db.Order.findOne({
            where: {
                id: _ID,
                live: true
            }
        });

        if(!Order){

            let error = new Error(`Order does not exists having id '${_ID}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    Order.status = _OBJECT.status;
    Order.updatedBy = _OBJECT.updatedBy;

    await Order.save();

    // Adding Tooths to Orders

    delete _OBJECT.updatedBy;

    return {
        DB_value: _OBJECT
    };


}

exports.Delete = async function ( _OBJECT, _ID ) {

    let where = {
        live: true,
        id: _ID,
    }

    let Order = await db.Order.findOne({
        attributes: { exclude: ['password'] },
        where
    });


    if(!Order ){

        let error = new Error("Order not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    Order.live = false;
    Order.updatedBy = _OBJECT.updatedBy;

    let result = await Order.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;
    
    return {
        DB_value: result
    };

}

exports.GetOrderStatus = async function ( _OBJECT ) {

    let where = {
        patientEmiratesId: _OBJECT['patientEmiratesId'],
        live: true,
    }

    let include = [
        { 
            as: 'tooths', 
            model: db.OrderTooth, 
            attributes: ['toothId'], 
            // paranoid: false, 
            required: true,
            where: { 
                live: true,
                toothId: _OBJECT['toothId']    
            },
            include: [
                {
                    as: 'ToothServices', 
                    model: db.OrderToothService, 
                    attributes: ['serviceId'], 
                    // paranoid: false, 
                    required: true,
                    include: [
                        {
                            as: 'LabService',
                            model: db.LabService, // will create a left join
                            attributes: [['serviceId', 'LabServiceId']],
                            required: true,
                            include: [
                                {
                                    as: 'Service',
                                    model: db.Service, // will create a left join
                                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                                    required: true,
                                    where: {
                                        live: true,
                                        id: _OBJECT['serviceId']
                                    }
                                },
                            ]
                        },
                    ]
                },

            ] 
        },
    ]

    let Orders = await db.Order.findAll({
        where,
        include,
    });


    if(!Orders){

        let error = new Error("Order not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    // GET FULL ORDERS DETAILS OF ORDERS FOUND

    include = [
        {
            as: 'Patient',
            model: db.Patient, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Shade',
            model: db.Shade, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        { 
            as: 'tooths', 
            model: db.OrderTooth, 
            attributes: ['toothId'], 
            paranoid: false, 
            required: false,
            where: { live: true },
            include: [
                {
                    as: 'Tooth',
                    model: db.Tooth, // will create a left join
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    as: 'ToothServices', 
                    model: db.OrderToothService, 
                    attributes: ['serviceId'], 
                    paranoid: false, 
                    required: false,
                    include: [
                        {
                            as: 'LabService',
                            model: db.LabService, // will create a left join
                            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                            include: [
                                {
                                    as: 'Service',
                                    model: db.Service, // will create a left join
                                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                                },
                            ]
                        },
                    ]
                },
                {
                    as: 'ToothPonticDesign', 
                    model: db.OrderToothPonticDesign, 
                    attributes: ['ponticDesignId'], 
                    paranoid: false, 
                    required: false,
                    include: [
                        {
                            as: 'PonticDesign',
                            model: db.PonticDesign, // will create a left join
                            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                        },
                    ]
                },
            ] 
        },
        {
            as: 'Invoices',
            model: db.Invoice, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            where: {
                live: true
            }
        },
    ]

    where = {
        live: true,
        id: []
    }

    // console.log(Orders);
    // Orders = Orders.get({ plain: true });
    for(let order of Orders){
        let orderObj = order.get({ plain: true });
        where.id.push(orderObj.id);
    }

    Orders = await db.Order.findAll({
        attributes: { exclude: ['password'] },
        where,
        include,
    });

    // Order = Order.get({ plain: true });

    return {
        DB_value: Orders
    };

}