const express = require('express');
const router = express.Router();
const { GetAll, Get, Create, Update, Delete:DeletePaitent, GetEachAndEvery, GetAllActive, addVisit } = require('../controllers/patient/patient.controller');
const { HandleNullString, AuthenticatePermission, Upload } = require('../middlewares');
const { Resources, Actions } = require('../utils/permissions');
const Resource = Resources['Patients'];

router.route('/')
.get(AuthenticatePermission(Resource, Actions['GetAll']), GetAll)                        // GET ALL Lab
.post(AuthenticatePermission(Resource, Actions['Create']), Upload.single('image'), HandleNullString, Create)                       // CREATE Lab

router.route('/:id')
.get(AuthenticatePermission(Resource, Actions['GetSingle']), Get)                           // GET Lab AGAINST ID
.put(AuthenticatePermission(Resource, Actions['Update']), Upload.single('image'), HandleNullString, Update)                        // UPDATE Lab
.delete(AuthenticatePermission(Resource, Actions['Delete']), DeletePaitent)                     // DELETE Lab

router.route('/all/records')
.get(AuthenticatePermission(Resource, Actions['GetAll']), GetEachAndEvery)       // GET Lab History

router.route('/all/active')
.get(AuthenticatePermission(Resource, Actions['GetAll']), GetAllActive)       // GET Lab All Active

router.route('/:patientId/visit')
    .get( AuthenticatePermission(Resource, Actions['Create']), addVisit )

module.exports = router;