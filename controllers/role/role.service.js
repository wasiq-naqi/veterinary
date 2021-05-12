var db = require('../../database/models');
const { Pagination } = require('../../functions');
const { Roles } = require('../../utils/permissions');

exports.GetAll = async function ( _PAGE, _LIMIT, _Token, _SEARCH ) {

    let where = {
        live: true,
    }
    
    if(_Token.role.id != Roles['Superman']){
        where['id'] = { [db.Sequelize.Op.ne]: Roles['Superman'] }
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { displayName: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
        ]

        if(_SEARCH == 'true' || _SEARCH == true || _SEARCH == 'false' || _SEARCH == false){
            let booleanOf = `%${(_SEARCH == 'false' || _SEARCH == false) ? 0 : 1}%`
            where[db.Sequelize.Op.or].push({
                active: { [db.Sequelize.Op.like]: booleanOf }
            });
        }

    }


    let association = {
        where
    }

    let result = await Pagination(_PAGE, _LIMIT, db.Role, association);

    return {
        DB_value: result
    };
}

exports.GetEachAndEvery = async function ( _Token, _SEARCH ) {
    
    let where = { 
        live: true,
    };

    if(_Token.role.id != Roles['Superman']){
        where['id'] = { [db.Sequelize.Op.ne]: Roles['Superman'] }
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { displayName: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
        ]

        if(_SEARCH == 'true' || _SEARCH == true || _SEARCH == 'false' || _SEARCH == false){
            let booleanOf = `%${(_SEARCH == 'false' || _SEARCH == false) ? 0 : 1}%`
            where[db.Sequelize.Op.or].push({
                active: { [db.Sequelize.Op.like]: booleanOf }
            });
        }

    }

    let Role = await db.Role.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Role
    };
}

exports.GetAllActive = async function ( _Token, _SEARCH ) {
    
    let where = { 
        live: true,
        active: true,
    };

    if(_Token.role.id != Roles['Superman']){
        where['id'] = { [db.Sequelize.Op.ne]: Roles['Superman'] }
    }

    if(_SEARCH){

        let searchOf = `%${_SEARCH}%`;
        where[db.Sequelize.Op.or]= [
            { id: { [db.Sequelize.Op.like]: searchOf } },
            { name: { [db.Sequelize.Op.like]: searchOf } },
            { displayName: { [db.Sequelize.Op.like]: searchOf } },
            { description: { [db.Sequelize.Op.like]: searchOf } },
        ]

        if(_SEARCH == 'true' || _SEARCH == true || _SEARCH == 'false' || _SEARCH == false){
            let booleanOf = `%${(_SEARCH == 'false' || _SEARCH == false) ? 0 : 1}%`
            where[db.Sequelize.Op.or].push({
                active: { [db.Sequelize.Op.like]: booleanOf }
            });
        }

    }

    let Role = await db.Role.findAll({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return {
        DB_value: Role
    };
}

exports.Get = async function ( _ID, _Token ) {

    let where = { 
        live: true,
        id: {
            [db.Sequelize.Op.eq]: _ID
        }
    };

    if(_Token.role.id != Roles['Superman']){
        where['id'][db.Sequelize.Op.ne] = Roles['Superman']
    }

    let Role = await db.Role.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where,
    });


    if(!Role){

        let error = new Error("Role not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: Role
    };

}

exports.Create = async (_OBJECT) => {

    let result = await db.Role.create(_OBJECT);

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };
    
    
}

exports.Update = async (_OBJECT, _ID, _Token) => {

    let where = { 
        live: true,
        id: {
            [db.Sequelize.Op.eq]: _ID
        }
    };

    if(_Token.role.id != Roles['Superman']){
        where['id'][db.Sequelize.Op.ne] = Roles['Superman']
    }

    let Role = await db.Role.findOne({
        attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        where
    });


    if(!Role){

        let error = new Error("Role not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }


    Role.name = _OBJECT.name;
    Role.displayName = _OBJECT.displayName;
    // Role.sequence = _OBJECT.sequence;
    Role.description = _OBJECT.description;
    Role.active = _OBJECT.active;
    Role.updatedBy = _OBJECT.updatedBy;

    let result = await Role.save();

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };


}

exports.Delete = async ( _ID, _Token ) => {

    let where = { 
        live: true,
        id: {
            [db.Sequelize.Op.eq]: _ID
        }
    };

    if(_Token.role.id != Roles['Superman']){
        where['id'][db.Sequelize.Op.ne] = Roles['Superman']
    }

    let Role = await db.Role.findOne({
        where,
    });


    if(!Role){

        let error = new Error("Role not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    Role.live = false;
    let result = await Role.save()

    delete result.dataValues.createdBy;
    delete result.dataValues.updatedBy;
    delete result.dataValues.updatedAt;
    delete result.dataValues.live;

    return {
        DB_value: result
    };

}