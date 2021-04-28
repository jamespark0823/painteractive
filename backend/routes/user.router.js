var express = require('express');
var router = express.Router();
const multer = require('multer');
var upload = multer()

const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/authenticate', upload.none(), userController.authenticate);

module.exports = router;