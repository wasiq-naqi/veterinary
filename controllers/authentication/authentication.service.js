var db = require('../../database/models');

// Importing Model directly from file
const ModelUser = require('../../database/models').User;

exports.Login = async function ( _OBJECT ) {

    // let User = await db.User.findOne({
    let User = await ModelUser.findOne({
        // attributes: { exclude: ['password'] },
        include: [{
            model: db.Role, // will create a left join
            attributes: { exclude: ['createdBy', 'updatedBy', 'updatedAt', 'live'] },
        }],
        where: {
            username: _OBJECT.username,
            active: true,
            live: true
        }
    });

    if(!User){

        let error = new Error("Username not found!");
        error.status = 404;
        return {
            DB_error: error
        };

    }

    return {
        DB_value: User
    };

}
