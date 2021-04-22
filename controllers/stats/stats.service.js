var db = require('../../models');
const { Pagination } = require('../../functions');
const { Roles } = require('../../utils/permissions');

exports.getEntitiesCount = async function ( ) {
    
    let where = ' WHERE live = 1'

    let result = await db.sequelize.query(
        "SELECT (SELECT COUNT(*) FROM `orders` WHERE live = 1) AS orders,"
        + "(SELECT COUNT(*) FROM `patients` WHERE live = 1) AS patients,"
        + "(SELECT COUNT(*) FROM `items` WHERE live = 1) AS items,"
        + "(SELECT COUNT(*) FROM `packages` WHERE live = 1) AS packages,"
        + "(SELECT COUNT(*) FROM `pets` WHERE live = 1) AS pets,"
        + "(SELECT COUNT(*) FROM `treatments` WHERE live = 1) AS treatments",
        { type: db.sequelize.QueryTypes.SELECT }
    );

    if(result) result = result[0];

    return {
        DB_value: result
    };

}