var db = require('../../models');
const { Pagination } = require('../../functions');
const { Roles } = require('../../utils/permissions');

exports.getAllUsers = async function ( _PAGE, _LIMIT, _USER, _SEARCH, _DATE, _APPOINTMENT, _CHECKUP ) {
    
    let where = {
        live: true,
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            // { patientEmiratesId: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            { appointment: { [db.Sequelize.Op.like]: searchOf } },
            { checkUpPrice: { [db.Sequelize.Op.like]: searchOf } },
            { price: { [db.Sequelize.Op.like]: searchOf } },

            { name: db.Sequelize.where(db.Sequelize.col('Patient.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.gender'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.contact'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.emiratesId'), { [db.Sequelize.Op.like]: searchOf  }) },
            { name: db.Sequelize.where(db.Sequelize.col('Patient.address'), { [db.Sequelize.Op.like]: searchOf  }) },

            // { name: db.Sequelize.where(db.Sequelize.col('Service.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            // { name: db.Sequelize.where(db.Sequelize.col('Service.displayName'), { [db.Sequelize.Op.like]: searchOf  }) },
        ]

    }

    if(_DATE){

        let searchOf = `${_DATE}`;
        if(!where.hasOwnProperty(db.Sequelize.Op.and)) where[db.Sequelize.Op.and] = [];
        // where[db.Sequelize.Op.and] = db.Sequelize.where(db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), searchOf);
        where[db.Sequelize.Op.and].push(db.Sequelize.where(db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), searchOf));
    }

    if(_APPOINTMENT){

        let searchOf = `${_APPOINTMENT}`;

        if(!where.hasOwnProperty(db.Sequelize.Op.and)) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push({ appointment: searchOf });
        
    }

    let include = [
        {
            as: 'Patient',
            model: db.Patient, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Items',
            model: db.OrderItem, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Item',
                model: db.Item,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Packages',
            model: db.OrderPackage, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Package',
                model: db.Package,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Pet',
                    model: db.Pet,
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    as: 'Doctor',
                    model: db.User,
                    attributes: ['id', 'image', 'name'],
                },
                {
                    as: 'Recomendations',
                    model: db.TreatmentRecomendationItem,
                    attributes: ["id", "itemId", "price"],
                    include: [
                        {
                            as: 'Item',
                            model: db.Item,
                            attributes: ["name", "description", "price"],
                        }
                    ]
                }
            ],
            where: {
                live: true,
            }
        },
    ]

    let association = {
        include,
        where,
        subQuery: false,
        distinct: true,
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] }
    };

    // Restrict doctor from getting order details
    if(_USER.roleId == Roles['Doctor']){
        association.include = [
            {
                as: 'Patient',
                model: db.Patient, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        as: 'Pet',
                        model: db.Pet,
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    },
                    {
                        as: 'Doctor',
                        model: db.User,
                        attributes: ['id', 'image', 'name'],
                    },
                    {
                        as: 'Recomendations',
                        model: db.TreatmentRecomendationItem,
                        attributes: ["id", "itemId", "price"],
                        include: [
                            {
                                as: 'Item',
                                model: db.Item,
                                attributes: ["name", "description", "price"],
                            }
                        ]
                    }
                ],
                where: {
                    live: true
                }
            },
        ]

        // get only where appointments are true
        association.where['appointment'] = true;

        // Remove Price
        association['attributes'] = { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live', 'price'] };
    }

    if( _CHECKUP == false || _CHECKUP == 'false' ) where['$Treatments.id$'] = null;
    if( _CHECKUP == true || _CHECKUP == 'true' ){
        let treatmentAssociationIndex = association.include.findIndex( e => e.as == 'Treatments' );
        association.include[treatmentAssociationIndex].required = true;
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Order, association);

    return {
        DB_value: result
    };
}

exports.Get = async function ( _ID, _USER ) {

    let attributes = { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] };

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
            as: 'Items',
            model: db.OrderItem, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Item',
                model: db.Item,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Packages',
            model: db.OrderPackage, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Package',
                model: db.Package,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Pet',
                    model: db.Pet,
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    as: 'Doctor',
                    model: db.User,
                    attributes: ['id', 'image', 'name'],
                },
                {
                    as: 'Recomendations',
                    model: db.TreatmentRecomendationItem,
                    attributes: ["id", "itemId", "price"],
                    include: [
                        {
                            as: 'Item',
                            model: db.Item,
                            attributes: ["name", "description", "price"],
                        }
                    ]
                }
            ],
            where: {
                live: true
            }
        },
    ]

    // Restrict doctor from getting order details
    if(_USER.roleId == Roles['Doctor']){
        include = [
            {
                as: 'Patient',
                model: db.Patient, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        as: 'Pet',
                        model: db.Pet,
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    },
                    {
                        as: 'Doctor',
                        model: db.User,
                        attributes: ['id', 'image', 'name'],
                    }
                ],
                where: {
                    live: true
                }
            },
        ]

        // get only where appointments are true
        where['appointment'] = true;

        // Remove Price
        attributes = { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live', 'price'] };
    }

    let Order = await db.Order.findOne({
        where,
        include,
        attributes
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

    let orderPrice = 0;
    let items = {};
    let packages = {};

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

    // Validating Items and calculating prices
    for(let item of _OBJECT['items']){

        let Item = await db.Item.findOne({
            where: {
                id: item.itemId,
                live: true
            },
            raw: true
        });

        if(!Item){

            let error = new Error(`Item does not exists having id '${item}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        orderPrice += ( +Item.price * +item.quantity );
        items[item.itemId] = Item; 
        items[item.itemId].quantity = item.quantity; 
        
    }

    // Validating Packages and calculating prices
    for(let item of _OBJECT['packages']){

        let Item = await db.Package.findOne({
            where: {
                id: item.packageId,
                live: true
            },
            raw: true
        });

        if(!Item){

            let error = new Error(`Package does not exists having id '${item}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        orderPrice += ( +Item.price * +item.quantity );
        packages[item.packageId] = Item; 
        packages[item.packageId].quantity = item.quantity; 
        
    }

    // adding checkup price
    orderPrice += +_OBJECT.checkUpPrice;

    // Creating Order
    let orderObject = {
        patientId: _OBJECT.patientId,
        appointment: _OBJECT.appointment,
        checkUpPrice: _OBJECT.checkUpPrice,
        price: orderPrice,
        description: _OBJECT.description,
        createdBy: _OBJECT.createdBy,
        followUp: _OBJECT.followUp
    }

    let Order = await db.Order.create(orderObject);

    if(Order){
        
        for(let item of _OBJECT['items']){

            await db.OrderItem.create({
                itemId: item.itemId,
                price: items[item.itemId].price,
                quantity: items[item.itemId].quantity,
                orderId: Order.dataValues.id,
                createdBy: _OBJECT.createdBy,
            });
            
        }

        for(let item of _OBJECT['packages']){

            await db.OrderPackage.create({
                packageId: item.packageId,
                price: packages[item.packageId].price,
                quantity: packages[item.packageId].quantity,
                orderId: Order.dataValues.id,
                createdBy: _OBJECT.createdBy,
            });
            
        }
    }

    if( _OBJECT.followUp ){

        try{

            // Creating a follow up entry
            let FollowUpInstance = await db.FollowUp.findOne({
                limit: 1,
                order: [ [ 'createdAt', 'DESC' ]],
                where: {
                    patientId: _OBJECT.patientId,
                }
            });

            
            if( FollowUpInstance && !FollowUpInstance.dataValues.isFollowUpDone ){
                await FollowUpInstance.update({ isFollowUpDone: true });
            }

        }
        catch( Excp ){

            let error = new Error("");
            error.status = 500;
            return {
                DB_error: error
            };

        }
        
    }
    
    _OBJECT.id = Order.dataValues.id;
    _OBJECT.price = orderPrice;
    _OBJECT.createdAt = Order.dataValues.createdAt;

    return {
        DB_value: _OBJECT
    };
    
    
}

exports.Update = async (_OBJECT, _ID, condition = {}) => {

    let OrderInstance = null, orderPrice = 0;
    let items = {};
    let packages = {};

    let itemsToAdd = [],
        itemsToUpdate = [],
        packagesToAdd = [],
        packagesToUpdate = [];

    if( _ID ){

        let where = {
            id: _ID,
            live: true
        }

        let include = [
            {
                as: 'Patient',
                model: db.Patient, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Items',
                model: db.OrderItem, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Packages',
                model: db.OrderPackage, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        as: 'Doctor',
                        model: db.User,
                        attributes: ['id', 'image', 'name'],
                    }
                ],
                where: {
                    live: true
                }
            },
        ]
        
        OrderInstance = await db.Order.findOne({
            where,
            include
        });

        if(!OrderInstance){

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
    
    let plainOrder = OrderInstance.get({ plain: true });

    // Validating Items and calculating prices
    for(let item of _OBJECT['items']){

        let quantityDifference = +item.quantity;
        let present = plainOrder.Items.find( e => e.itemId == item.itemId );
        if( present && present.quantity >= item.quantity ) continue;
        if( present && present.quantity < item.quantity ) quantityDifference = item.quantity - present.quantity;

        let Item = await db.Item.findOne({
            where: {
                id: item.itemId,
                live: true
            },
            raw: true
        });

        if(!Item){

            let error = new Error(`Item does not exists having id '${item}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        orderPrice += ( +Item.price * quantityDifference );
        items[item.itemId] = Item;
        items[item.itemId].quantity = item.quantity;

        if( !present ) itemsToAdd.push(item.itemId);
        else itemsToUpdate.push({ orderItemId: present.id, itemId: item.itemId });
        
        
        
    }

    // Validating Packages and calculating prices
    for(let item of _OBJECT['packages']){

        let quantityDifference = +item.quantity;
        let present = plainOrder.Packages.find( e => e.packageId == item.packageId );
        if( present && present.quantity >= item.quantity ) continue;
        if( present && present.quantity < item.quantity ) quantityDifference = item.quantity - present.quantity;

        let Item = await db.Package.findOne({
            where: {
                id: item.packageId,
                live: true
            },
            raw: true
        });

        if(!Item){

            let error = new Error(`Package does not exists having id '${item}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        orderPrice += ( +Item.price * quantityDifference ) ;
        packages[item.packageId] = Item;
        packages[item.packageId].quantity = item.quantity;

        if( !present ) packagesToAdd.push(item.packageId);
        else packagesToUpdate.push({ orderPackageId: present.id, packageId: item.packageId });

    }
    
    // Validating Price
    if( _OBJECT.checkUpPrice != plainOrder.checkUpPrice ){
        _OBJECT.price = plainOrder.price - plainOrder.checkUpPrice;
        _OBJECT.price += (_OBJECT.checkUpPrice + orderPrice);
    }
    else{
        _OBJECT.price = plainOrder.price + orderPrice;
    }

    try{

        await OrderInstance.update( _OBJECT );
        
        for(let item of itemsToAdd ){

            await db.OrderItem.create({
                itemId: item,
                price: items[item].price,
                quantity: items[item].quantity,
                orderId: _ID,
                createdBy: _OBJECT.createdBy,
            });
            
        }

        for( let instance of itemsToUpdate ){
            
            await db.OrderItem.update(
                { quantity: items[instance.itemId].quantity},
                { where:{ id: instance.orderItemId } }
            );

        }

        for(let item of packagesToAdd ){

            await db.OrderPackage.create({
                packageId: item,
                price: packages[item].price,
                quantity: packages[item].quantity,
                orderId: _ID,
                createdBy: _OBJECT.createdBy,
            });
            
        }

        for( let instance of packagesToUpdate ){
            
            await db.OrderPackage.update(
                { quantity: packages[instance.packageId].quantity },
                { where:{ id: instance.orderPackageId } }
            );

        }

        let where = {
            id: _ID,
            live: true
        }

        let include = [
            {
                as: 'Patient',
                model: db.Patient, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Items',
                model: db.OrderItem, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Packages',
                model: db.OrderPackage, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        as: 'Doctor',
                        model: db.User,
                        attributes: ['id', 'image', 'name'],
                    }
                ],
                where: {
                    live: true
                }
            },
        ]
        
        let OrderInstance2 = await db.Order.findOne({
            where,
            include
        });

        if(!OrderInstance2){

            let error = new Error(`Order does not exists having id '${_ID}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        return {
            DB_value: OrderInstance2
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

exports.getOrdersByPatient = async function ( _PATIENT, _USER, _DATE, _APPOINTMENT, _CHECKUP ) {
    
    let Patient = await db.Patient.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _PATIENT,
            live: true
        },
        raw: true
    });

    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let where = {
        live: true,
        patientId: _PATIENT
    }

    if(_DATE){

        let searchOf = `${_DATE}`;
        if(!where.hasOwnProperty(db.Sequelize.Op.and)) where[db.Sequelize.Op.and] = [];
        // where[db.Sequelize.Op.and] = db.Sequelize.where(db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), searchOf);
        where[db.Sequelize.Op.and].push(db.Sequelize.where(db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), searchOf));
    }

    if(_APPOINTMENT){

        let searchOf = `${_APPOINTMENT}`;

        if(!where.hasOwnProperty(db.Sequelize.Op.and)) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push({ appointment: searchOf });
        
    }

    let include = [
        {
            as: 'Items',
            model: db.OrderItem, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Item',
                model: db.Item,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Packages',
            model: db.OrderPackage, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Package',
                model: db.Package,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Pet',
                    model: db.Pet,
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    as: 'Doctor',
                    model: db.User,
                    attributes: ['id', 'image', 'name'],
                },
                {
                    as: 'Recomendations',
                    model: db.TreatmentRecomendationItem,
                    attributes: ["id", "itemId", "price"],
                    include: [
                        {
                            as: 'Item',
                            model: db.Item,
                            attributes: ["name", "description", "price"],
                        }
                    ]
                }
            ],
            where: {
                live: true
            }
        },
    ]

    let association = {
        include,
        where,
        subQuery: false,
        distinct: true,
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        order: [ ['id', 'DESC'] ],
    };

    // Restrict doctor from getting order details
    if(_USER.roleId == Roles['Doctor']){
        association.include = [
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        as: 'Pet',
                        model: db.Pet,
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    },
                    {
                        as: 'Doctor',
                        model: db.User,
                        attributes: ['id', 'image', 'name'],
                    },
                    {
                        as: 'Recomendations',
                        model: db.TreatmentRecomendationItem,
                        attributes: ["id", "itemId", "price"],
                        include: [
                            {
                                as: 'Item',
                                model: db.Item,
                                attributes: ["name", "description", "price"],
                            }
                        ]
                    }
                ],
                where: {
                    live: true
                }
            },
        ]

        // get only where appointments are true
        association.where['appointment'] = true;

        // Remove Price
        association['attributes'] = { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live', 'price'] };
    }

    if( _CHECKUP == false || _CHECKUP == 'false' ) where['$Treatments.id$'] = null;
    if( _CHECKUP == true || _CHECKUP == 'true' ){
        let treatmentAssociationIndex = association.include.findIndex( e => e.as == 'Treatments' );
        association.include[treatmentAssociationIndex].required = true;
    }

    let result = await db.Order.findAndCountAll(association);
    result['Patient'] = Patient;

    return {
        DB_value: result
    };
}

exports.getOrdersByPet = async function ( _PET, _USER, _DATE, _APPOINTMENT, _CHECKUP ) {

    let Pet = await db.Pet.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _PET,
            live: true
        },
        raw: true
    });

    if(!Pet){

        let error = new Error("Pet not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let Patient = await db.Patient.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: Pet.patientId,
            // live: true
        },
        raw: true
    });

    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let where = {
        live: true
    }

    if(_DATE){

        let searchOf = `${_DATE}`;
        if(!where.hasOwnProperty(db.Sequelize.Op.and)) where[db.Sequelize.Op.and] = [];
        // where[db.Sequelize.Op.and] = db.Sequelize.where(db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), searchOf);
        where[db.Sequelize.Op.and].push(db.Sequelize.where(db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), searchOf));
    }

    if(_APPOINTMENT){

        let searchOf = `${_APPOINTMENT}`;

        if(!where.hasOwnProperty(db.Sequelize.Op.and)) where[db.Sequelize.Op.and] = [];
        where[db.Sequelize.Op.and].push({ appointment: searchOf });
        
    }

    let include = [
        {
            as: 'Items',
            model: db.OrderItem, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Item',
                model: db.Item,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Packages',
            model: db.OrderPackage, // will create a left join
            paranoid: false, 
            required: false,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Package',
                model: db.Package,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId']
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: true,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Pet',
                    model: db.Pet,
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                    required: true,
                    where: {
                        id: _PET
                    }
                },
                {
                    as: 'Doctor',
                    model: db.User,
                    attributes: ['id', 'image', 'name'],
                },
                {
                    as: 'Recomendations',
                    model: db.TreatmentRecomendationItem,
                    attributes: ["id", "itemId", "price"],
                    include: [
                        {
                            as: 'Item',
                            model: db.Item,
                            attributes: ["name", "description", "price"],
                        }
                    ]
                }
            ],
            where: {
                live: true
            }
        },
    ]

    let association = {
        include,
        where,
        subQuery: false,
        distinct: true,
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        order: [ ['id', 'DESC'] ],
    };

    // Restrict doctor from getting order details
    if(_USER.roleId == Roles['Doctor']){
        
        association.include = [
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                include: [
                    {
                        as: 'Pet',
                        model: db.Pet,
                        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                        required: true,
                        where: {
                            id: _PET
                        }
                    },
                    {
                        as: 'Doctor',
                        model: db.User,
                        attributes: ['id', 'image', 'name'],
                    },
                    {
                        as: 'Recomendations',
                        model: db.TreatmentRecomendationItem,
                        attributes: ["id", "itemId", "price"],
                        include: [
                            {
                                as: 'Item',
                                model: db.Item,
                                attributes: ["name", "description", "price"],
                            }
                        ]
                    }
                ],
                where: {
                    live: true
                }
            },
        ]

        // get only where appointments are true
        association.where['appointment'] = true;

        // Remove Price
        association['attributes'] = { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live', 'price'] };
    }

    if( _CHECKUP == false || _CHECKUP == 'false' ) where['$Treatments.id$'] = null;
    if( _CHECKUP == true || _CHECKUP == 'true' ){
        let treatmentAssociationIndex = association.include.findIndex( e => e.as == 'Treatments' );
        association.include[treatmentAssociationIndex].required = true;
    }

    let result = await db.Order.findAndCountAll(association);
    result['Patient'] = Patient;
    result['Pet'] = Pet;

    return {
        DB_value: result
    };

}