const express = require('express');

const authController = require('../controllers/auth.js');

const router = express.Router();

router.get('/login',authController.getLogin);

module.exports = router;