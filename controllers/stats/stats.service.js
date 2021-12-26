var db = require('../../database/models');
const moment = require('moment');

exports.getEntitiesCount = async function ( ) {

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

exports.getDashboardReport = async function ({ fromDate, toDate}) {

    const todayDate = moment().utcOffset('+0400').format('YYYY-MM-DD');
    
    fromDate = fromDate ?? todayDate;
    toDate = toDate ?? todayDate;

    // const where = ` `;
    const query = `
        SELECT 
            (SELECT COUNT(*)    FROM visits WHERE live = 1 AND date BETWEEN '${fromDate}' AND '${toDate}') AS visits,
            (SELECT COUNT(*)    FROM orders WHERE live = 1 AND createdAt BETWEEN '${fromDate}' AND '${toDate}') AS orders,
            COALESCE((SELECT SUM(price)  FROM orders WHERE live = 1 AND createdAt BETWEEN '${fromDate}' AND '${toDate}'), 0) AS income,
            (SELECT COUNT(*)    FROM treatments WHERE live = 1 AND createdAt BETWEEN '${fromDate}' AND '${toDate}') AS treatments
    `;

    let result = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT } );
    if(result) result = result[0];

    return {
        DB_value: result
    };

}