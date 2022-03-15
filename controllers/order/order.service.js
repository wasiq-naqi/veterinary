/* eslint-disable no-prototype-builtins */
var db = require('../../database/models');
const { Op, literal } = require('sequelize');
const { Pagination } = require('../../functions');
const { Roles } = require('../../utils/permissions');
// const moment = require('moment-timezone');

// exports.getAllUsers = async function ( _PAGE, _LIMIT, _USER, _SEARCH, _DATE, _APPOINTMENT, _CHECKUP ) {
exports.getAllUsersOld = async function ( object ) {
    
    let {
        pageNo: _PAGE,
        pageSize: _LIMIT,
        user: _USER,
        search: _SEARCH,
        // date: _DATE,
        fromDate,
        toDate,
        assignTo,
        appointment: _APPOINTMENT,
        checkUp: _CHECKUP,
    } = object;

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

    if( fromDate ){

        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push( 
            db.Sequelize.where(
                db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), '>=', fromDate) 
        );

    }

    if( toDate ){

        
        // let momentDate = moment().tz(toDate, 'Asia/Dubai' ).format();

        // let momentDate = moment( '2021-04-30' ).format();
        // let date = new Date( '2021-04-30' );

        // let format = 'YYYY/MM/DD HH:mm:ss ZZ';
        // let test = moment(date, format);
        // console.log('test', test);

        // console.log( date.toString() );
        // console.log( momentDate );

        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push( 
            db.Sequelize.where(
                db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), '<=', toDate) 
        );


    }

    if(_APPOINTMENT){

        let searchOf = `${_APPOINTMENT}`;
        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push({ appointment: searchOf });
        
    }

    if(assignTo){

        let searchOf = `${assignTo}`;
        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push({ assignTo: searchOf });
        
    }

    let include = [
        {
            as: 'Patient',
            model: db.Patient, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'AssignTo',
            model: db.User, // will create a left join
            attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Items',
            model: db.OrderItem, // will create a left join
            paranoid: false, 
            required: false,
            separate: true,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Item',
                model: db.Item,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
            }
        },
        {
            as: 'Packages',
            model: db.OrderPackage, // will create a left join
            paranoid: false, 
            required: false,
            separate: true,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: {
                as: 'Package',
                model: db.Package,
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
            }
        },
        {
            as: 'Treatments',
            model: db.Treatment, // will create a left join
            paranoid: false, 
            required: false,
            // separate: true,
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
                separate: true,
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'AssignTo',
                model: db.User, // will create a left join
                separate: true,
                attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
            },
            {
                as: 'Treatments',
                model: db.Treatment, // will create a left join
                paranoid: false, 
                required: false,
                separate: true,
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

exports.getAllUsers = async function ( object ) {
    
    let {
        pageNo: _PAGE,
        pageSize: _LIMIT,
        user: _USER,
        search: _SEARCH,
        // date: _DATE,
        fromDate,
        toDate,
        assignTo,
        appointment: _APPOINTMENT,
        checkUp: _CHECKUP,
    } = object;

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

    if( fromDate ){

        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push( 
            db.Sequelize.where(
                db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), '>=', fromDate) 
        );

    }

    if( toDate ){

        
        // let momentDate = moment().tz(toDate, 'Asia/Dubai' ).format();

        // let momentDate = moment( '2021-04-30' ).format();
        // let date = new Date( '2021-04-30' );

        // let format = 'YYYY/MM/DD HH:mm:ss ZZ';
        // let test = moment(date, format);
        // console.log('test', test);

        // console.log( date.toString() );
        // console.log( momentDate );

        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push( 
            db.Sequelize.where(
                db.Sequelize.fn('date', db.Sequelize.col('Order.createdAt')), '<=', toDate) 
        );


    }

    if(_APPOINTMENT){

        let searchOf = `${_APPOINTMENT}`;
        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push({ appointment: searchOf });
        
    }

    if(assignTo){

        let searchOf = `${assignTo}`;
        let hasProperty = Object.prototype.hasOwnProperty.call(where, db.Sequelize.Op.and);
        if( !hasProperty ) where[db.Sequelize.Op.and] = [];

        where[db.Sequelize.Op.and].push({ assignTo: searchOf });
        
    }

    let include = [
        {
            as: 'Patient',
            model: db.Patient, // will create a left join
            // attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            attributes: ['id', 'name', 'email', 'contact'],
        },
        // {
        //     as: 'AssignTo',
        //     model: db.User, // will create a left join
        //     // attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //     attributes: ['id', 'name'],
        // },
        // {
        //     as: 'Items',
        //     model: db.OrderItem, // will create a left join
        //     paranoid: false, 
        //     required: false,
        //     separate: true,
        //     attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //     include: {
        //         as: 'Item',
        //         model: db.Item,
        //         attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
        //         include: {
        //             model: db.Service,
        //             as: 'Service',
        //             attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //         },
        //     }
        // },
        // {
        //     as: 'Packages',
        //     model: db.OrderPackage, // will create a left join
        //     paranoid: false, 
        //     required: false,
        //     separate: true,
        //     attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //     include: {
        //         as: 'Package',
        //         model: db.Package,
        //         attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
        //         include: {
        //             model: db.Service,
        //             as: 'Service',
        //             attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //         },
        //     }
        // },
        // {
        //     as: 'Treatments',
        //     model: db.Treatment, // will create a left join
        //     paranoid: false, 
        //     required: false,
        //     // separate: true,
        //     attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //     include: [
        //         {
        //             as: 'Pet',
        //             model: db.Pet,
        //             attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //         },
        //         {
        //             as: 'Doctor',
        //             model: db.User,
        //             attributes: ['id', 'image', 'name'],
        //         },
        //         {
        //             as: 'Recomendations',
        //             model: db.TreatmentRecomendationItem,
        //             attributes: ["id", "itemId", "price"],
        //             include: [
        //                 {
        //                     as: 'Item',
        //                     model: db.Item,
        //                     attributes: ["name", "description", "price"],
        //                 }
        //             ]
        //         }
        //     ],
        //     where: {
        //         live: true,
        //     }
        // },
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
                // separate: true,
                // attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                attributes: ['id', 'name', 'email', 'contact'],
            },
            {
                as: 'AssignTo',
                model: db.User, // will create a left join
                // separate: true,
                // attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
                attributes: ['id', 'name'],
            },
            // {
            //     as: 'Treatments',
            //     model: db.Treatment, // will create a left join
            //     paranoid: false, 
            //     required: false,
            //     separate: true,
            //     attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            //     include: [
            //         {
            //             as: 'Pet',
            //             model: db.Pet,
            //             attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            //         },
            //         {
            //             as: 'Doctor',
            //             model: db.User,
            //             attributes: ['id', 'image', 'name'],
            //         },
            //         {
            //             as: 'Recomendations',
            //             model: db.TreatmentRecomendationItem,
            //             attributes: ["id", "itemId", "price"],
            //             include: [
            //                 {
            //                     as: 'Item',
            //                     model: db.Item,
            //                     attributes: ["name", "description", "price"],
            //                 }
            //             ]
            //         }
            //     ],
            //     where: {
            //         live: true
            //     }
            // },
        ]

        // get only where appointments are true
        association.where['appointment'] = true;
        association.where['assignTo'] = _USER.userId;

        // Remove Price
        association['attributes'] = { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live', 'price'] };

    }

    // if( _CHECKUP == false || _CHECKUP == 'false' ) where['$Treatments.id$'] = null;
    // if( _CHECKUP == true || _CHECKUP == 'true' ){
    //     // let treatmentAssociationIndex = association.include.findIndex( e => e.as == 'Treatments' );
    //     // association.include[treatmentAssociationIndex].required = true;

    //     const treatmentAssociation = {
    //         as: 'Treatments',
    //         attributes: ['id'],
    //         model: db.Treatment, // will create a left join
    //         required: true,
    //     };

    //     association.include.push( treatmentAssociation );

    // }

    if( _CHECKUP == true || _CHECKUP == 'true' ) association.where['checkupDone'] = true;
    if( _CHECKUP == false || _CHECKUP == 'false' ) association.where['checkupDone'] = false;

    

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
            as: 'AssignTo',
            model: db.User, // will create a left join
            attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
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
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
            },
            where:{
                live: true
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
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
            },
            where:{
                live: true
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

    let Patient;
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

    if( _OBJECT.assignTo ){

        let User = await db.User.findOne({
            where: {
                id: _OBJECT.assignTo,
                live: true
            },
            include: [{
                model: db.Role, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt'] }
            }]
        });

        if(!User){

            let error = new Error(`Assigni does not exists having id '${_OBJECT.assignTo}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        let UserPlain = User.get({ plain: true });

        if(UserPlain.Role.name.toLowerCase() != 'doctor'){

            let error = new Error(`Assigni having id '${_OBJECT.assignTo}' is not a doctor`);
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

        const itemPriceBeforeDiscount = ( +Item.price * +item.quantity );
        const itemDiscountInPrice = +( (+item.discount * itemPriceBeforeDiscount) / 100 ).toFixed(2);
        const itemPriceAfterDiscount = +(+itemPriceBeforeDiscount - +itemDiscountInPrice).toFixed(2);

        orderPrice += itemPriceAfterDiscount;
        items[item.itemId] = Item;
        items[item.itemId].itemPrice = +Item.price;
        items[item.itemId].priceDiscounted = itemPriceAfterDiscount; 
        items[item.itemId].discount = item.discount; 
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

        const packagePriceBeforeDiscount = ( +Item.price * +item.quantity );
        const packageDiscountInPrice = +( (+item.discount * packagePriceBeforeDiscount) / 100 ).toFixed(2);
        const packagePriceAfterDiscount = +(packagePriceBeforeDiscount - packageDiscountInPrice).toFixed(2);

        orderPrice += packagePriceAfterDiscount;
        packages[item.packageId] = Item;
        packages[item.packageId].packagePrice = +Item.price; 
        packages[item.packageId].priceDiscounted = packagePriceAfterDiscount; 
        packages[item.packageId].discount = item.discount; 
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
        followUp: _OBJECT.followUp,
        assignTo: _OBJECT.assignTo
    }

    let Order = await db.Order.create(orderObject);

    if(Order){
        
        for(let item of _OBJECT['items']){

            await db.OrderItem.create({
                itemId: item.itemId,
                itemPrice: items[item.itemId].itemPrice,
                price: items[item.itemId].priceDiscounted,
                quantity: items[item.itemId].quantity,
                discount: items[item.itemId].discount,
                orderId: Order.dataValues.id,
                createdBy: _OBJECT.createdBy,
            });
            
        }

        for(let item of _OBJECT['packages']){

            await db.OrderPackage.create({
                packageId: item.packageId,
                packagePrice: packages[item.packageId].packagePrice,
                price: packages[item.packageId].priceDiscounted,
                quantity: packages[item.packageId].quantity,
                discount: packages[item.packageId].discount,
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

    try{

        // Updating patiesnt status
        let updatePatient = await Patient.update({ noOrder: false, lastVisitAt:literal('CURRENT_TIMESTAMP') });

    }
    catch( Excp ){
        let error = new Error("Internal Server Error");
        error.status = 500;
        return {
            DB_error: error
        };
    }
    
    _OBJECT.id = Order.dataValues.id;
    _OBJECT.price = orderPrice;
    _OBJECT.createdAt = Order.dataValues.createdAt;

    // if(_OBJECT.patientId) await updatePatientLastVisit({ patientId:_OBJECT.patientId });

    return {
        DB_value: _OBJECT
    };
    
    
}

exports.UpdateDeprecated = async (_OBJECT, _ID, condition = {}) => {

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

    if( _OBJECT.assignTo ){

        const User = await db.User.findOne({
            where: {
                id: _OBJECT.assignTo,
                live: true
            },
            include: [{
                model: db.Role, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt'] }
            }]
        });

        if(!User){

            let error = new Error(`Assigni does not exists having id '${_OBJECT.assignTo}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        let UserPlain = User.get({ plain: true });

        if(UserPlain.Role.name.toLowerCase() != 'doctor'){

            let error = new Error(`Assigni having id '${_OBJECT.assignTo}' is not a doctor`);
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
        items[item.itemId].itemPrice = +Item.price;
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
        packages[item.packageId].packagePrice = +Item.price; 
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
                itemPrice: items[item].itemPrice,
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
                packagePrice: items[item].packagePrice,
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

exports.UpdateOld = async (_OBJECT, _ID, condition = {}) => {

    let where = {
        id: _ID,
        live: true
    }
    
    let OrderInstance = await db.Order.findOne({ where });
    if(!OrderInstance){

        let error = new Error(`Order does not exists having id '${_ID}'`);
        error.status = 400;
        return {
            DB_error: error
        }; 

    }
    const OrderInstancePlain = getPlain( OrderInstance );
    
    let transaction = await db.sequelize.transaction();

    try{

        let newPrice = 0;

        let itemsToFetch = _OBJECT['items'].map( item => +item?.itemId );
        let packagesToFetch = _OBJECT['packages'].map( item => +item?.packageId );

        const items = await db.Item.findAll({ 
            attributes:['id', 'price'],
            where:{ 
                id: { [Op.in]: itemsToFetch }, 
                live:true 
            }
        });
        const itemsPlain = getPlain(items);

        const packages = await db.Package.findAll({ 
            attributes:['id', 'price'], 
            where:{
                id: { [Op.in]: packagesToFetch },
                live:true 
            }
        });
        const packagesPlain = getPlain(packages);

        // insert items to database
        for( let item of itemsPlain ){

            const itemId = item.id;
            const userItem = _OBJECT['items'].find( e => e.itemId = itemId );

            const totalItemPrice = +getDiscountedPrice({ price:item.price, quantity:userItem.quantity, discount:userItem.discount });
            newPrice = newPrice + totalItemPrice;

            // insert to database
            await db.OrderItem.create({
                itemId,
                price: totalItemPrice,
                itemPrice: item.price,
                quantity: userItem.quantity,
                discount: userItem.discount,
                orderId: _ID,
                createdBy: _OBJECT.createdBy,
            }, { transaction });

        }

        // insert packages to database
        for( let package of packagesPlain ){

            const packageId = package.id;
            const userPackage = _OBJECT['items'].find( e => e.packageId = packageId );

            const totalItemPrice = +getDiscountedPrice({ price:package.price, quantity:userPackage.quantity, discount:userPackage.discount });
            newPrice = newPrice + totalItemPrice;

            // insert to database
            await db.OrderPackage.create({
                packageId,
                price: totalItemPrice,
                packagePrice: package.price,
                quantity: userPackage.quantity,
                discount: userPackage.discount,
                orderId: _ID,
                createdBy: _OBJECT.createdBy,
            }, { transaction });
            
        }

        const UpdatedPrice = OrderInstancePlain.price + newPrice;
        await OrderInstance.update({ price:UpdatedPrice }, { transaction });

        // Commit transaction
        await transaction.commit();

        await updatePatientLastVisit({ patientId:OrderInstancePlain.patientId });
        const UpdateOrderInstancePlain = getPlain(OrderInstance);

        return {
            DB_value: UpdateOrderInstancePlain
        };

    }
    catch( Excp ){

        await transaction.rollback();

        console.log({ Excp });
        let error = new Error("");
        error.status = 500;
        return {
            DB_error: error
        };

    }

}

exports.Update = async (_OBJECT, _ID, condition = {}) => {

    let where = {
        id: _ID,
        live: true
    }

    const { items, packages } = _OBJECT;
    
    let OrderInstance = await db.Order.findOne({ where });
    if(!OrderInstance){

        let error = new Error(`Order does not exists having id '${_ID}'`);
        error.status = 400;
        return {
            DB_error: error
        }; 

    }
    const OrderInstancePlain = getPlain( OrderInstance );
    
    // Get existing items
    const orderExistingItemsInstance = await db.OrderItem.findAll({
        attributes:['id', 'itemId', 'itemPrice', 'price', 'discount', 'quantity'],
        where:{
            orderId: _ID,
            live: true
        } 
    });
    const orderExistingItems = getPlain(orderExistingItemsInstance);

    // Get existing packages
    const orderExistingPackagesInstance = await db.OrderPackage.findAll({
        attributes:['id', 'packageId', 'packagePrice', 'price', 'discount', 'quantity'],
        where:{
            orderId: _ID,
            live: true
        } 
    });
    const orderExistingPackages = getPlain(orderExistingPackagesInstance);

    //fetch new Items to add
    const newItemsIds = items.reduce((previousValue, currentValue) => {
        if(!currentValue.id) previousValue.push(currentValue.itemId);
        return previousValue;
    }, []);
    let newItems = [];

    if(newItemsIds){
        const newItemsInstance = await db.Item.findAll({
            where:{
                id:{
                    [Op.in]: newItemsIds
                }
            }
        });
        newItems = getPlain(newItemsInstance);
    }

    //fetch new Packages to add
    const newPackagesId = packages.reduce((previousValue, currentValue) => {
        if(!currentValue.id) previousValue.push(currentValue.packageId);
        return previousValue;
    }, []);
    let newPackages = [];

    if(newPackagesId){
        const newPackagesInstance = await db.Package.findAll({
            where:{
                id:{
                    [Op.in]: newPackagesId
                }
            }
        });
        newPackages = getPlain(newPackagesInstance);
    }
    
    let updatedPrice = 0;

    const itemsToRemove = [];
    const itemsToUpdate = [];
    const itemsToAdd = [];
    let itemAlreadyAdded = 0;

    const packagesToRemove = [];
    const packagesToUpdate = [];
    const packagesToAdd = [];
    let packageAlreadyAdded = 0;

    let transaction = await db.sequelize.transaction();

    try{

        // Handle items
        for(let existingItem of orderExistingItems){

            // add new items
            if(!itemAlreadyAdded){
                for(let item of items){
                    if(!item.id){
                        
                        itemsToAdd.push(item);
                        const dbItem = newItems.find(db => db.id == item.itemId);
                        const body = {
                            itemId: dbItem.id,
                            itemPrice: dbItem.price,
                            price: getDiscountedPrice({ price:dbItem.price, quantity:item.quantity, discount:item.discount }),
                            quantity: item.quantity,
                            discount: item.discount,
                            orderId: _ID,
                            createdBy: _OBJECT.updatedBy,
                        };

                        updatedPrice += +body.price;
                        await db.OrderItem.create(body, { transaction });

                    }
                }
            }
            
            const itemPresent = items.findIndex( item => item.id == existingItem.id );
            const item = itemPresent != -1 ? items[itemPresent] : null;

            // remove items
            if(itemPresent == -1) {
                itemsToRemove.push(existingItem.id);
                // remove item query here
                await db.OrderItem.update({ live:false }, { where: { id:existingItem.id }, transaction });
            }

            // items to update
            if(itemPresent != -1 && (item?.quantity != existingItem.quantity || item?.discount != existingItem.discount) ){
                item.itemPrice = existingItem.itemPrice;
                itemsToUpdate.push(item);

                // update item query here
                const body = {
                    discount: item?.discount,
                    quantity: item?.quantity,
                    price: getDiscountedPrice({ price:item.itemPrice, quantity: item?.quantity, discount: item?.discount })
                }

                updatedPrice += +body.price;
                await db.OrderItem.update(body, { where: { id:item.id }, transaction });
            }
            else if(itemPresent != -1){
                updatedPrice += +existingItem.price;
            }
            
            itemAlreadyAdded = 1;

        }

        // Handle packages
        for(let existingPackage of orderExistingPackages){

            // add new packages
            if(!packageAlreadyAdded){
                for(let package of packages){
                    if(!package.id){
                        packagesToAdd.push(package);

                        const dbPackage = newPackages.find(db => db.id == package.packageId);
                        const body = {
                            packageId: dbPackage.id,
                            packagePrice: dbPackage.price,
                            price: getDiscountedPrice({ price:dbPackage.price, quantity:package.quantity, discount:package.discount }),
                            quantity: package.quantity,
                            discount: package.discount,
                            orderId: _ID,
                            createdBy: _OBJECT.updatedBy,
                        };

                        updatedPrice += +body.price;
                        await db.OrderPackage.create(body, { transaction });

                    }
                }
            }
            
            const packagePresent = packages.findIndex( package => package.id == existingPackage.id );
            const package = packagePresent != -1 ? packages[packagePresent] : null;

            // remove packages
            if(packagePresent == -1) {
                packagesToRemove.push(existingPackage.id);
                // remove package query here
                await db.OrderPackage.update({ live:false }, { where: { id:existingPackage.id }, transaction });
            }

            // packages to update
            if(packagePresent != -1 && (package?.quantity != existingPackage.quantity || package?.discount != existingPackage.discount) ){
                package.packagePrice = existingPackage.packagePrice;
                packagesToUpdate.push(package);

                // update package query here
                // update item query here
                const body = {
                    discount: package?.discount,
                    quantity: package?.quantity,
                    price: getDiscountedPrice({ price:package?.packagePrice, quantity: package?.quantity, discount: package?.discount })
                }

                updatedPrice += +body.price;
                await db.OrderPackage.update(body, { where: { id:package.id }, transaction });

            }
            else if(packagePresent != -1){
                updatedPrice += +existingPackage.price;
            }
            
            packageAlreadyAdded = 1;

        }

        // add checkup price
        updatedPrice += OrderInstancePlain.checkUpPrice ?? 0;

        // Update order price
        await OrderInstance.update({ price:updatedPrice }, { transaction });
        OrderInstance.reload();

        transaction.commit();

        // Update last visit date
        await updatePatientLastVisit({ patientId:OrderInstancePlain.patientId });

    }
    catch(Excp){
        console.log(Excp);
        transaction.rollback();
    }


    return {
        DB_value: OrderInstance
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

exports.UpdateDoctor = async (_OBJECT, _ID) => {

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

    if( _OBJECT.assignTo ){

        let User = await db.User.findOne({
            where: {
                id: _OBJECT.assignTo,
                live: true
            },
            include: [{
                model: db.Role, // will create a left join
                attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt'] }
            }]
        });

        if(!User){

            let error = new Error(`Assigni does not exists having id '${_OBJECT.assignTo}'`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

        let UserPlain = User.get({ plain: true });

        if(UserPlain.Role.name.toLowerCase() != 'doctor'){

            let error = new Error(`Assigni having id '${_OBJECT.assignTo}' is not a doctor`);
            error.status = 400;
            return {
                DB_error: error
            }; 

        }

    }

    Order.assignTo = _OBJECT.assignTo;
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
            as: 'AssignTo',
            model: db.User, // will create a left join
            attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
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
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
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
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
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
            as: 'AssignTo',
            model: db.User, // will create a left join
            attributes: { exclude: ['password', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
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
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
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
                attributes: ['name', 'description', 'active', 'price', 'petTypeId', 'serviceId'],
                include: {
                    model: db.Service,
                    as: 'Service',
                    attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
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

function getPlain( object ){

    if( Array.isArray(object) ){
        return object.map( el => el.get({ plain:true }) );
    }
    else {
        return object ? object.get({ plain:true }) : null;
    }

}

function getDiscountedPrice({ price=0, quantity=1, discount=0 }){

    const priceAfterDiscount = price - ( price * discount ) / 100;
    return priceAfterDiscount * quantity;

}

async function updatePatientLastVisit({ patientId }){
    
    return db.Patient.update({ lastVisitAt:literal('CURRENT_TIMESTAMP') }, {
        where:{
            id:patientId
        }
    });

}