const express = require('express');
const router = express.Router();
const { getEntitiesCount } = require('../controllers/stats/stats.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');

router.route('/entities/count')
.get(getEntitiesCount)                


module.exports = router;