const express = require('express');
const router = express.Router();
const { upload } = require('../controllers/upload/upload.controller');

router.route('/file')
    .post(upload)

module.exports = router;