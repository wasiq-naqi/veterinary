var db = require('../../database/models');
const { Pagination } = require('../../functions');

exports.GetAll = async function ( _PAGE, _LIMIT) {

    let include = [
        {
            as: 'Order',
            model: db.Order, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Patient',
                    model: db.Patient, // will create a left join
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
                }
            ]
        },
        {
            as: 'Pet',
            model: db.Pet,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Recomendations',
            model: db.TreatmentRecomendationItem,
            attributes: ["itemId", "price"],
            include: [
                {
                    as: 'Item',
                    model: db.Item,
                    attributes: ["name", "description", "price"],
                }
            ]
        }
    ];

    let association = {
        where: {
            live: true
        },
        include
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Treatment, association);

    return {
        DB_value: result
    };

}

exports.Get = async function ( _ID ) {

    let include = [
        {
            as: 'Order',
            model: db.Order, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Patient',
                    model: db.Patient, // will create a left join
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
                }
            ]
        },
        {
            as: 'Pet',
            model: db.Pet,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        }
    ];
    let Treatment = await db.Treatment.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        include,
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Treatment){

        let error = new Error("Treatment not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: Treatment
    };

}

exports.Create = async (_OBJECT) => {

    let items = {};

    let Order = await db.Order.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.orderId,
            live: true
        }
    });

    if(!Order){

        let error = new Error("Order not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let Pet = await db.Pet.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.petId,
            patientId: Order.dataValues.patientId,
            live: true
        }
    });


    if(!Pet){

        let error = new Error("Pet not found or not associate with the visitor.");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let Treatment;

    try{

        Treatment = await db.Treatment.create(_OBJECT);

        // Validating Items and calculating prices
        for(let item of _OBJECT['recomendations']){

            let Item = await db.Item.findOne({
                where: {
                    id: item,
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

            items[item] = Item; 
            
        }

        // Inserting recomendations to treatment
        for(let item of _OBJECT['recomendations']){

            await db.TreatmentRecomendationItem.create({
                treatmentId: Treatment.dataValues.id,
                itemId: item,
                price: items[item].price,
                orderId: Order.dataValues.id,
                createdBy: _OBJECT.createdBy,
            });
            
        }


        if( _OBJECT.followUp ){

            // creating entry for notification
            db.Notification.create({
                patientId: Order.dataValues.patientId,
                orderId: _OBJECT.orderId,
                doctorId: _OBJECT.createdBy,
                date: _OBJECT.followUp,
                createdBy: _OBJECT.createdBy
            });

            // creating entry for follow up
            db.FollowUp.create({
                patientId: Order.dataValues.patientId,
                orderId: _OBJECT.orderId,
                doctorId: _OBJECT.createdBy,
                date: _OBJECT.followUp,
                createdBy: _OBJECT.createdBy
            });

        }

        await Order.update({ checkupDone:true });

    }
    catch( Excp ){
        
        console.log( Excp );

        let error = new Error("");
        error.status = 500;
        return {
            DB_error: error
        };

    }
    

    let result = await db.Treatment.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: Treatment.dataValues.id,
            live: true
        },
        include: [
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
        ]
    });

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID) => {

    let items = {};
    let itemsToAdd = [];

    let Treatment = await db.Treatment.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        },
        include: [
            {
                as: 'Recomendations',
                model: db.TreatmentRecomendationItem,
                attributes: ["id", "itemId", "price"],
            }
        ]
    });

    if(!Treatment){

        let error = new Error("Treatment not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let Order = await db.Order.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.orderId,
            live: true
        }
    });


    if(!Order){

        let error = new Error("Order not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }
    
    let Pet = await db.Pet.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _OBJECT.petId,
            live: true
        }
    });


    if(!Pet){

        let error = new Error("Pet not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let plainTreatment = Treatment.get({ plain: true });

    let Save = await db.Treatment.update(_OBJECT,{
        where: {
            id: _ID
        }
    })

    if(!Save){
        console.log(Save);
        let error = new Error("Failed to update!");
        error.status = 500;
        return {
            DB_error: error
        };
    }
    
    

    // Validating Items and calculating prices
    for(let item of _OBJECT['recomendations']){

        let present = plainTreatment.Recomendations.find( e => e.itemId == item );
        if( present ) continue;

        let Item = await db.Item.findOne({
            where: {
                id: item,
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

        items[item] = Item;
        itemsToAdd.push(item); 
        
    }

    // Inserting recomendations to treatment
    for(let item of itemsToAdd){

        await db.TreatmentRecomendationItem.create({
            treatmentId: plainTreatment.id,
            itemId: item,
            price: items[item].price,
            orderId: Order.dataValues.id,
            createdBy: _OBJECT.createdBy,
        });
        
    }



    let result = await db.Treatment.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        },
        include: [
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
        ]
    });

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };


}

exports.Delete = async ( _ID ) => {

    let Treatment = await db.Treatment.findOne({
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Treatment){

        let error = new Error("Treatment not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    Treatment.live = false;
    let result = await Treatment.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };

}

exports.GetTreatmentsByPetsId = async function ( _OBJECT, _PAGE, _LIMIT ) {

    // let Pets = await db.Patient.findAll({
    //     attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
    //     where: {
    //         patientId: _OBJECT['patientId'],
    //         live: true
    //     }
    // });


    // if(!Pets){

    //     let error = new Error("Pets not found!");
    //     error.status = 404;
    //     return {
    //         DB_error: error
    //     };

    // }

    // return {
    //     DB_value: Pets
    // };

    let include = [
        {
            as: 'Order',
            model: db.Order, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
            include: [
                {
                    as: 'Patient',
                    model: db.Patient, // will create a left join
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'live'] },
                },
                {
                    as: 'AssignTo',
                    model: db.User, // will create a left join
                    attributes: ['id', 'name'],
                }
            ]
        },
        {
            as: 'Pet',
            model: db.Pet,
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        },
        {
            as: 'Recomendations',
            model: db.TreatmentRecomendationItem,
            attributes: ["itemId", "price"],
            include: [
                {
                    as: 'Item',
                    model: db.Item,
                    attributes: ["name", "description", "price"],
                }
            ]
        }
    ];

    let association = {
        where: {
            petId: _OBJECT['petId'],
            live: true
        },
        include
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Treatment, association);

    return {
        DB_value: result
    };
    
}