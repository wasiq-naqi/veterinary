var db = require('../../models');
const { Pagination } = require('../../functions');

exports.GetAll = async function ( _PAGE, _LIMIT) {

    let association = {
        where: {
            live: true
        }
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Treatment, association);

    return {
        DB_value: result
    };

}

exports.Get = async function ( _ID ) {

    let Treatment = await db.Treatment.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
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

    let result = await db.Treatment.create(_OBJECT);

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID) => {

    let Treatment = await db.Treatment.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
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

    Treatment.petId = _OBJECT.petId;
    Treatment.statement = _OBJECT.statement;
    Treatment.prescription = _OBJECT.prescription;
    Treatment.description = _OBJECT.description;
    Treatment.updatedBy = _OBJECT.updatedBy;

    let result = await Treatment.save();

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

    let association = {
        where: {
            petId: _OBJECT['petId'],
            live: true
        }
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Treatment, association);

    return {
        DB_value: result
    };
    
}