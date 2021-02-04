const express = require('express');
const router = express.Router();
const { GetAll, Get, Create, Update, Delete, GetEachAndEvery, GetAllActive } = require('../controllers/services/services.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');
const Resource = Resources['Services'];

router.route('/')
.get(AuthenticatePermission(Resource, Actions['GetAll']),GetAll)                        // GET ALL Notice
.post(AuthenticatePermission(Resource, Actions['Create']),HandleNullString, Create)                       // CREATE Notice

router.route('/:id')
.get(AuthenticatePermission(Resource, Actions['GetSingle']),Get)                           // GET Notice AGAINST ID
.put(AuthenticatePermission(Resource, Actions['Update']),HandleNullString, Update)                        // UPDATE Notice
.delete(AuthenticatePermission(Resource, Actions['Delete']),Delete)                     // DELETE Notice

router.route('/all/records')
.get(AuthenticatePermission(Resource, Actions['GetAll']),GetEachAndEvery)       // GET Notice History

router.route('/all/active')
.get(AuthenticatePermission(Resource, Actions['GetAll']),GetAllActive)       // GET Lab History

module.exports = router;