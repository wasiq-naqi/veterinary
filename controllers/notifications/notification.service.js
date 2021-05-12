var db = require('../../database/models');
const { Pagination } = require('../../functions');


exports.GetAll = async function ( _PAGE, _LIMIT, _DATE) {

    let association = {
        include: {
            model: db.Patient,
            as: 'Patient',
            attributes: ['image', 'emiratesId', 'name', 'contact'],
        },
        where: {
            live: true
        },
        order: [
            ['isRead', 'ASC'],
            ['id', 'DESC']
        ]
    }

    if(_DATE){

        association.where[db.Sequelize.Op.or]= [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), _DATE),
        ]

    }

    let result = await Pagination(_PAGE, _LIMIT, db.Notification, association);

    return {
        DB_value: result
    };
}

exports.GetEachAndEvery = async function ( _DATE ) {
    
    let Notification = await db.Notification.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        include: {
            model: db.Patient,
            as: 'Patient',
            attributes: ['image', 'emiratesId', 'name', 'contact'],
        },
        where: {
            live: true,
            [db.Sequelize.Op.or]: db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), _DATE),
        },
        order: [
            ['isRead', 'ASC'],
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Notification
    };
}

exports.MakeReadSingle = async function ( _ID ) {
    
    let Instance = await db.Notification.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            live: true,
            id: _ID
        },
    });

    if(!Instance){
        let error = new Error("Notification not found!");
        error.status = 404;
        return {
            DB_error: error
        };
    }

    try{
        await Instance.update({ isRead: true });
    }
    catch( Excp ){

        let error = new Error("");
        error.status = 500;
        return {
            DB_error: error
        };

    }  

    return {
        DB_value: Instance
    };

}