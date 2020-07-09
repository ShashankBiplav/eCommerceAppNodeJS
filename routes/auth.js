const express = require('express');

const expressValidator = require('express-validator');

const authController = require('../controllers/auth.js');

const router = express.Router();

router.get('/login',authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',authController.postLogin);

router.post('/signup', expressValidator.check('email').isEmail().withMessage('Please enter a valid Email'), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;