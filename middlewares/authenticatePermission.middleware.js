const { Errors } = require('../functions');
// IMPORTING DATABASE
const DB = require('../models/index');

module.exports = (resourceId, actionId) => {
    return async (req, res, next) => {

        let Permission = await DB.Permission.findOne({
            where: {
                resourceId: resourceId,
                actionId: actionId
            }
        });

        if( !Permission ) return Errors(res, { message: "Permission Denied", status: 403 });

        let permissionId = Permission.dataValues.id;
        let roleId = req.token.role.id;

        let AssignedPermission = await DB.RolePermission.findOne({
            where: {
                roleId,
                permissionId,
            }
        });

        // console.log(AssignedPermission.dataValues);
        if(!AssignedPermission || !AssignedPermission.dataValues.live) return Errors(res, { message: "Permission Denied", status: 403 });

        next();
        
    }
}
