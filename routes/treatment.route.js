const express = require('express');
const router = express.Router();
const { GetAll, Get, Create, Update, Delete, TreatmentsByPetsId, uploadTreatmentFile } = require('../controllers/treatment/treatment.controller');
const { HandleNullString, AuthenticatePermission } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');
const Resource = Resources['Treatments'];

router.route('/')
.get(AuthenticatePermission(Resource, Actions['GetAll']), GetAll)                        // GET ALL Lab
.post(AuthenticatePermission(Resource, Actions['Create']), HandleNullString, Create)                       // CREATE Lab

router.route('/:id')
.get(AuthenticatePermission(Resource, Actions['GetSingle']), Get)                           // GET Lab AGAINST ID
.put(AuthenticatePermission(Resource, Actions['Update']), HandleNullString, Update)                        // UPDATE Lab
.delete(AuthenticatePermission(Resource, Actions['Delete']), Delete)                     // DELETE Lab

router.route('/:id/image')
    .patch(AuthenticatePermission(Resource, Actions['Update']), HandleNullString, uploadTreatmentFile)

router.route('/all/pets')
.post(AuthenticatePermission(Resource, Actions['GetAll']), TreatmentsByPetsId) 
module.exports = router;