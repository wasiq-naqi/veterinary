var db = require('../../models');
const { Pagination } = require('../../functions');

exports.GetAll = async function ( _PAGE, _LIMIT) {

    let association = {
        where: {
            live: true
        }
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Pet, association);

    return {
        DB_value: result
    };

}

exports.GetEachAndEvery = async function () {
    
    let Pet = await db.Pet.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            live: true
        },
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Pet
    };
}

exports.Get = async function ( _ID ) {

    let Pet = await db.Pet.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        },
        include: [ 
            { model: db.Patient }
        ]
    });


    if(!Pet){

        let error = new Error("Pet not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: Pet
    };

}

exports.Create = async (_OBJECT) => {

    let Patient = await db.Patient.findOne({
        where: {
            id: _OBJECT.patientId,
            live: true
        }
    })

    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    // let PetType = await db.PetType.findOne({
    //     where: {
    //         id: _OBJECT.petTypeId,
    //         live: true
    //     }
    // })

    // if(!PetType){

    //     let error = new Error("Pet type id not found!");
    //     error.status = 404;
    //     return {
    //         DB_error: error
    //     };

    // }

    let result = await db.Pet.create(_OBJECT);

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID) => {

    let Pet = await db.Pet.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
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

    let Patient = await db.Patient.findOne({
        where: {
            id: _OBJECT.patientId,
            live: true
        }
    })

    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    // let PetType = await db.PetType.findOne({
    //     where: {
    //         id: _OBJECT.petTypeId,
    //         live: true
    //     }
    // })

    // if(!PetType){

    //     let error = new Error("Pet type id not found!");
    //     error.status = 404;
    //     return {
    //         DB_error: error
    //     };

    // }

    // if(_OBJECT.image != 'null' && _OBJECT.image != null && _OBJECT.image != ''){
    //     Pet.image = _OBJECT.image;
    // }

    if(_OBJECT.image == 'null' || _OBJECT.image == null || _OBJECT.image == ''){
        delete _OBJECT.image;
    }

    try{

        let result = await Pet.update( _OBJECT );
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

    // console.log(_OBJECT);

    // Pet.name = _OBJECT.name;
    // Pet.color = _OBJECT.color;
    // Pet.pet = _OBJECT.pet;
    // Pet.age = _OBJECT.age;
    // Pet.gender = _OBJECT.gender;
    // Pet.dob = _OBJECT.dob;
    // Pet.patientId = _OBJECT.patientId;
    // Pet.petTypeId = _OBJECT.petTypeId;
    // Pet.description = _OBJECT.description;
    // Pet.updatedBy = _OBJECT.updatedBy;

    // let result = await Pet.save();

    // delete result.dataValues.createdBy;
    // delete result.dataValues.updatedBy;
    // delete result.dataValues.updatedAt;
    // delete result.dataValues.live;

    // return {
    //     DB_value: result
    // };


}

exports.Delete = async ( _ID ) => {

    let Pet = await db.Pet.findOne({
        where: {
            id: _ID,
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

    Pet.live = false;
    let result = await Pet.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };

}

exports.GetPetsByPatientId = async function ( _OBJECT, _PAGE, _LIMIT ) {

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
            patientId: _OBJECT['patientId'],
            live: true
        }
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Pet, association);

    return {
        DB_value: result
    };
    
}