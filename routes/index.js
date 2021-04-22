const express = require('express');
const router = express.Router();
const { Authenticate, DecodeToken } = require('../middlewares');

// INCLUDING ROUTES
const authentication = require('./authentication.route');
const user = require('./user.route');
const role = require('./role.route');
const service = require('./service.route');
const OrderRoutes = require('./order.route');
const patients = require('./patient.route');
const pets = require('./pet.route');
const treatments = require('./treatment.route');
const petTypes = require('./petType.route');
const item = require('./item.route');
const package = require('./package.route');
const notification = require('./notification.route');
const stat = require('./stats.route');

// router.get('/', (req, res)=>{
//     res.send('API Page');
// });


// REGESTRING ROUTES
router.use('/authentication', authentication);
router.use('/users', Authenticate, DecodeToken, user);
router.use('/roles', Authenticate, DecodeToken, role);
router.use('/services', Authenticate, DecodeToken, service);
router.use('/orders', Authenticate, DecodeToken, OrderRoutes);
router.use('/patients', Authenticate, DecodeToken, patients);
router.use('/pets', Authenticate, DecodeToken, pets);
router.use('/treatments', Authenticate, DecodeToken, treatments);
router.use('/pet-types', Authenticate, DecodeToken, petTypes);
router.use('/items', Authenticate, DecodeToken, item);
router.use('/packages', Authenticate, DecodeToken, package);
router.use('/notifications', Authenticate, DecodeToken, notification);
router.use('/stats', Authenticate, DecodeToken, stat);

module.exports = router;
