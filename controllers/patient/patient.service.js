var db = require('../../models');
const { Pagination } = require('../../functions');

exports.GetAll = async function ( _PAGE, _LIMIT, _SEARCH) {

    let where = {
        live: true
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { emiratesId: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { email: { [db.Sequelize.Op.like]: searchOf } },
            { contact: { [db.Sequelize.Op.like]: searchOf } },
            { gender: { [db.Sequelize.Op.like]: searchOf } },
            // { name: db.Sequelize.where(db.Sequelize.col('Patient.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            // { name: db.Sequelize.where(db.Sequelize.col('Patient.gender'), { [db.Sequelize.Op.like]: searchOf  }) },
            // { name: db.Sequelize.where(db.Sequelize.col('Patient.contact'), { [db.Sequelize.Op.like]: searchOf  }) },
            // { name: db.Sequelize.where(db.Sequelize.col('Patient.emiratesId'), { [db.Sequelize.Op.like]: searchOf  }) },
            // { name: db.Sequelize.where(db.Sequelize.col('Patient.address'), { [db.Sequelize.Op.like]: searchOf  }) },

            // { name: db.Sequelize.where(db.Sequelize.col('Service.name'), { [db.Sequelize.Op.like]: searchOf  }) },
            // { name: db.Sequelize.where(db.Sequelize.col('Service.displayName'), { [db.Sequelize.Op.like]: searchOf  }) },
        ]

    }

    let association = {
        where: where
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

    let emirateId = await db.Patient.findOne({
        where: {
            emiratesId: _OBJECT.emiratesId,
            live: true
        }
    });

    if(emirateId){
        let error = new Error(`Patient already exist having emirates id: '${_OBJECT.emiratesId}'`);
        error.status = 400;
        return {
            DB_error: error
        };
    }

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

        let error = new Error("Patient not found.");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    let emirateId = await db.Patient.findOne({
        where: {
            emiratesId: _OBJECT.emiratesId,
            id: {
                [db.Sequelize.Op.ne]: _ID
            },
            live: true
        }
    });

    console.log(emirateId, _OBJECT.emiratesId);

    if(emirateId){
        let error = new Error(`Patient already exist having emirates id: '${_OBJECT.emiratesId}'`);
        error.status = 400;
        return {
            DB_error: error
        };
    }

    if(_OBJECT.image == 'null' || _OBJECT.image == null || _OBJECT.image == ''){
        delete _OBJECT.image;
    }

    try{

        let result = await Patient.update(_OBJECT);

        // let result = await db.Patient.findOne({
        //     attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        //     where: {
        //         id: _ID,
        //         live: true
        //     }
        // });

        // delete result.dataValues.createdBy;
        // delete result.dataValues.updatedBy;
        // delete result.dataValues.updatedAt;
        // delete result.dataValues.live;

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

    // Patient.emiratesId = _OBJECT.emiratesId;
    // Patient.name = _OBJECT.name;
    // Patient.email = _OBJECT.email;
    // Patient.gender = _OBJECT.gender;
    // Patient.contact = _OBJECT.contact;
    // Patient.dob = _OBJECT.dob;
    // Patient.address = _OBJECT.address;
    // Patient.updatedBy = _OBJECT.updatedBy;

    // let result = await Patient.save();

    


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