const express = require('express');
const router = express.Router();
const { GetAll, Get, Create, Update, Delete, GetEachAndEvery, GetAllActive } = require('../controllers/item/item.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');

router.route('/')
.get(AuthenticatePermission(Resources['Items'], Actions['GetAll']), GetAll)                // GET ALL Items
.post(AuthenticatePermission(Resources['Items'], Actions['Create']), HandleNullString, Create)               // CREATE USER

router.route('/:id')
.get(AuthenticatePermission(Resources['Items'], Actions['GetSingle']), Get)                   // GET USER AGAINST ID
.put(AuthenticatePermission(Resources['Items'], Actions['Update']), HandleNullString, Update)                // UPDATE USER
.delete(AuthenticatePermission(Resources['Items'], Actions['Delete']), Delete)             // DELETE USER

router.route('/records/all')
.get(AuthenticatePermission(Resources['Items'], Actions['GetAll']), GetEachAndEvery)

router.route('/records/active')
.get(AuthenticatePermission(Resources['Items'], Actions['GetAll']), GetAllActive)
module.exports = router;