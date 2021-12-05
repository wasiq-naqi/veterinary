const express = require('express');
const router = express.Router();
const { getEntitiesCount, getDashboardReport } = require('../controllers/stats/stats.controller');
// const { HandleNullString, AuthenticatePermission } = require('../middlewares');
// const { Resources, Actions } = require('../utils/permissions');

router.route('/entities/count')
    .get(getEntitiesCount)
    
router.route('/dashboard/report')
    .post( getDashboardReport )


module.exports = router;