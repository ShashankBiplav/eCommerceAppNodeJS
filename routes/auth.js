const express = require('express');

const expressValidator = require('express-validator');

const authController = require('../controllers/auth.js');

const User = require('../models/user.js');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    expressValidator.check('email').isEmail().withMessage('Please enter a valid Email').normalizeEmail(),
    expressValidator.check('password','Please enter a valid password').isLength({ min: 5}).isAlphanumeric().trim()
], authController.postLogin);

router.post('/signup', [
    expressValidator.check('email').isEmail().withMessage('Please enter a valid Email')
    .custom((value, {
        req
    }) => {
        return User.findOne({
            email: value
        }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject('Email already exists');
            }
        })
    }).normalizeEmail(),
    expressValidator.check('password', 'Please enter a password with number and text and at least 5 characters long').isLength({
        min: 5
    }).isAlphanumeric().trim(),
    expressValidator.check('confirmPassword').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match');
        }
        return true;
    }).trim()
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;