const express = require('express');
const router = express.Router();
const { GetAll, GetEachAndEvery, MakeReadSingle } = require('../controllers/notifications/notification.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');
const Resource = Resources['Notifications'];

router.route('/')
.get(AuthenticatePermission(Resource, Actions['GetAll']), GetAll)                        // GET ALL Lab

router.route('/:id')
.get(AuthenticatePermission(Resource, Actions['GetAll']), MakeReadSingle)                        // GET ALL Lab

router.route('/all/records')
.get(AuthenticatePermission(Resource, Actions['GetAll']), GetEachAndEvery) 
module.exports = router;