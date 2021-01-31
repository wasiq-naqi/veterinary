const express = require('express');
const router = express.Router();
const { GetAll, Get, Create, Update, Delet } = require('../controllers/patient/patient.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');
let Model = Resources['Patient'];

router.route('/')
.get(AuthenticatePermission(Model, Actions['GetAll']), GetAll)                        // GET ALL Lab
.post(AuthenticatePermission(Model, Actions['Create']), upload.single('image'), HandleNullString, Create)                       // CREATE Lab

router.route('/:id')
.get(AuthenticatePermission(Model, Actions['GetSingle']), Get)                           // GET Lab AGAINST ID
.put(AuthenticatePermission(Model, Actions['Update']), upload.single('image'), HandleNullString, Update)                        // UPDATE Lab
.delete(AuthenticatePermission(Model, Actions['Delete']), Delete)                     // DELETE Lab

module.exports = router;