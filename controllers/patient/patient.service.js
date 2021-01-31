var db = require('../../models');
const { Pagination } = require('../../functions');

exports.GetAll = async function ( _PAGE, _LIMIT) {

    let association = {
        where: {
            live: true
        }
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Patient, association);

    return {
        DB_value: result
    };

}

exports.GetEachAndEvery = async function () {
    
    let Patient = await db.Patient.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            live: true
        },
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Patient
    };
}

exports.Get = async function ( _ID ) {

    let Patient = await db.Patient.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: Patient
    };

}

exports.Create = async (_OBJECT) => {

    let result = await db.Patient.create(_OBJECT);

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID) => {

    let Patient = await db.Patient.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    if(_OBJECT.image != 'null' && _OBJECT.image != null && _OBJECT.image != ''){
        Shade.image = _OBJECT.image;
    }

    Patient.emiratesId = _OBJECTemiratesIde;
    Patient.name = _OBJECT.name;
    Patient.gender = _OBJECT.gender;
    Patient.contact = _OBJECT.contact;
    Patient.dob = _OBJECT.dob;
    Patient.address = _OBJECT.address;
    Patient.updatedBy = _OBJECT.updatedBy;

    let result = await Patient.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };


}

exports.Delete = async ( _ID ) => {

    let Patient = await db.Patient.findOne({
        where: {
            id: _ID,
            live: true
        }
    });


    if(!Patient){

        let error = new Error("Patient not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    Patient.live = false;
    let result = await Patient.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };

}