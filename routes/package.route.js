const express = require('express');
const router = express.Router();
const { GetAll, Get, Create, Update, Delete, GetEachAndEvery, GetAllActive } = require('../controllers/package/package.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');

router.route('/')
.get(AuthenticatePermission(Resources['Users'], Actions['GetAll']), GetAll)                // GET ALL USERS
.post(AuthenticatePermission(Resources['Users'], Actions['Create']), HandleNullString, Create)               // CREATE USER

router.route('/:id')
.get(AuthenticatePermission(Resources['Users'], Actions['GetSingle']), Get)                   // GET USER AGAINST ID
.put(AuthenticatePermission(Resources['Users'], Actions['Update']), HandleNullString, Update)                // UPDATE USER
.delete(AuthenticatePermission(Resources['Users'], Actions['Delete']), Delete)             // DELETE USER

router.route('/records/all')
.get(AuthenticatePermission(Resources['Items'], Actions['GetAll']), GetEachAndEvery);

router.route('/records/active')
.get(AuthenticatePermission(Resources['Items'], Actions['GetAll']), GetAllActive);
module.exports = router;