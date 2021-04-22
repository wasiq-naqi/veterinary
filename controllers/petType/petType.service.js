var db = require('../../models');
const { Pagination } = require('../../functions');

let modelName = 'Pet Type';

exports.GetAll = async function ( _PAGE, _LIMIT, _SEARCH ) {

    let association = {
        where: {
            live: true
        }
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        association.where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            // { active: { [db.Sequelize.Op.like]: booleanOf } },
        ]

        if(_SEARCH == 'true' || _SEARCH == true || _SEARCH == 'false' || _SEARCH == false){
            let booleanOf = `%${(_SEARCH == 'false' || _SEARCH == false) ? 0 : 1}%`
            association.where[db.Sequelize.Op.or].push({
                active: { [db.Sequelize.Op.like]: booleanOf }
            });
        }

    }

    let result = await Pagination(_PAGE, _LIMIT, db.PetType, association);

    return {
        DB_value: result
    };

}

exports.GetEachAndEvery = async function ( _SEARCH ) {
    
    let where = {
        live: true
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            // { active: { [db.Sequelize.Op.like]: booleanOf } },
        ]

        if(_SEARCH == 'true' || _SEARCH == true || _SEARCH == 'false' || _SEARCH == false){
            let booleanOf = `%${(_SEARCH == 'false' || _SEARCH == false) ? 0 : 1}%`
            where[db.Sequelize.Op.or].push({
                active: { [db.Sequelize.Op.like]: booleanOf }
            });
        }

    }

    let Response = await db.PetType.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Response
    };
}

exports.GetAllActive = async function ( _SEARCH ) {
    
    let where = {
        live: true,
        active: true
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
            // { active: { [db.Sequelize.Op.like]: booleanOf } },
        ]

        if(_SEARCH == 'true' || _SEARCH == true || _SEARCH == 'false' || _SEARCH == false){
            let booleanOf = `%${(_SEARCH == 'false' || _SEARCH == false) ? 0 : 1}%`
            where[db.Sequelize.Op.or].push({
                active: { [db.Sequelize.Op.like]: booleanOf }
            });
        }

    }

    let PetType = await db.PetType.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: PetType
    };
}

exports.Get = async function ( _ID ) {

    let PonticDesign = await db.PetType.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where: {
            id: _ID,
            live: true
        }
    });


    if(!PonticDesign){

        let error = new Error(modelName + " not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: PonticDesign
    };

}

exports.Create = async (_OBJECT) => {

    let result = await db.PetType.create(_OBJECT);

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID) => {

    let Instance = await db.PetType.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
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

    try{

        let result = await Instance.update( _OBJECT );

        delete result.dataValues.createdBy;
        delete result.dataValues.updatedBy;
        delete result.dataValues.updatedAt;
        delete result.dataValues.live;

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

}

exports.Delete = async ( _ID ) => {

    let PonticDesign = await db.PetType.findOne({
        where: {
            id: _ID,
            live: true
        }
    });


    if(!PonticDesign){

        let error = new Error( modelName + " not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    PonticDesign.live = false;
    let result = await PonticDesign.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };

}