 const crypto = require('crypto');

 const bcrypt = require('bcryptjs');

 const expressValidator = require('express-validator');

 const User = require('../models/user.js');


 var SibApiV3Sdk = require('sib-api-v3-sdk');
 var defaultClient = SibApiV3Sdk.ApiClient.instance;
 // Configure API key authorization: api-key
 var apiKey = defaultClient.authentications['api-key'];
 apiKey.apiKey = "your provided api keys here"
 // Configure API key authorization: partner-key
 var partnerKey = defaultClient.authentications['partner-key'];
 partnerKey.apiKey = "your provided api keys here"
 var apiInstance = new SibApiV3Sdk.SMTPApi();


 exports.getLogin = (req, res, next) => {
     let message = req.flash('error');
     if (message.length > 0) {
         message = message[0];
     } else {
         message = null;
     }
     res.render('auth/login', {
         path: '/login',
         pageTitle: 'Login',
         errorMessage: message,
         oldInput: {
             email: '',
             password: ''
         },
         validationErrors: []
     });
 };

 exports.getSignup = (req, res, next) => {
     let message = req.flash('error');
     if (message.length > 0) {
         message = message[0];
     } else {
         message = null;
     }
     res.render('auth/signup', {
         path: '/signup',
         pageTitle: 'SignUp',
         errorMessage: message,
         oldInput: {
             email: '',
             password: '',
             confirmPassword: ''
         },
         validationErrors: []

     });
 };

 exports.postLogin = (req, res, next) => {
     const email = req.body.email;
     const password = req.body.password;
     const errors = expressValidator.validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(422).render('auth/login', {
             path: '/login',
             pageTitle: 'Login',
             errorMessage: errors.array()[0].msg,
             oldInput: {
                 email: email,
                 password: password
             },
             validationErrors: errors.array()
         });
     }
     User.findOne({
             email: email
         })
         .then(user => {
             if (!user) {
                 return res.status(422).render('auth/login', {
                     path: '/login',
                     pageTitle: 'Login',
                     errorMessage: 'Invalid email or password.',
                     oldInput: {
                         email: email,
                         password: password
                     },
                     validationErrors: []
                 });
             }
             bcrypt.compare(password, user.password)
                 .then(passwordMatch => { // comapare returns boolean if the password matches
                     if (passwordMatch) {
                         req.session.isLoggedIn = true;
                         req.session.user = user; //user => user retrieved from DB
                         return req.session.save((err) => {
                             console.log(err);
                             res.redirect('/');
                         });
                     }
                     return res.status(422).render('auth/login', {
                         path: '/login',
                         pageTitle: 'Login',
                         errorMessage: 'Invalid email or password.',
                         oldInput: {
                             email: email,
                             password: password
                         },
                         validationErrors: []
                     });
                 })
                 .catch(err => {
                     console.log(err);
                     res.redirect('/login');
                 });
         })
         .catch(err => {
             const error = new Error(err);
             error.httpStatusCode = 500;
             return next(error);
         });
 };

 exports.postSignup = (req, res, next) => {
     const email = req.body.email;
     const password = req.body.password;
     const errors = expressValidator.validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(422).render('auth/signup', {
             path: '/signup',
             pageTitle: 'SignUp',
             errorMessage: errors.array()[0].msg,
             oldInput: {
                 email: email,
                 password: password,
                 confirmPassword: req.body.confirmPassword
             },
             validationErrors: errors.array()
         });
     }
     bcrypt
         .hash(password, 12)
         .then(hashedPassword => {
             const user = new User({
                 email: email,
                 password: hashedPassword,
                 cart: {
                     items: []
                 }
             });
             return user.save();
         }).then(result => {
             res.redirect('/login');
             sendSmtpEmail = {
                 to: [{
                     email: email,
                     name: email
                 }],
                 templateId: 4,
                 params: {
                     name: 'John',
                     surname: 'Doe'
                 },
                 subject: 'Sign up successful'
             };

             apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                 console.log('API call successful. Email Sent. Returned data: ' + data);
             }, function (err) {
                 const error = new Error(err);
                 error.httpStatusCode = 500;
                 return next(error);
             });
         })
 };

 exports.postLogout = (req, res, next) => {
     req.session.destroy((err) => {
         console.log(err);
         res.redirect('/');
     });
 };

 exports.getReset = (req, res, next) => {
     let message = req.flash('error');
     if (message.length > 0) {
         message = message[0];
     } else {
         message = null;
     }
     res.render('auth/reset', {
         path: '/reset',
         pageTitle: 'Reset Password',
         errorMessage: message
     });
 };

 exports.postReset = (req, res, next) => {
     crypto.randomBytes(32, (error, buffer) => {
         if (error) {
             console.log(error);
             return res.redirect('/reset');
         }
         const token = buffer.toString('hex');
         User.findOne({
                 email: req.body.email
             })
             .then(user => {
                 if (!user) {
                     req.flash('error', 'No account with that email found');
                     return res.redirect('/reset');
                 }
                 user.resetToken = token;
                 user.resetTokenExpiryDate = Date.now() + 3600000;
                 return user.save();
             })
             .then(result => {
                 res.redirect('/');
                 sendSmtpEmail = {
                     to: [{
                         email: req.body.email,
                         name: req.body.email
                     }],
                     templateId: 5,
                     params: {
                         EMAIL: req.body.email,
                         RESETLINK: `http://localhost:3000/reset/${token}`
                     },
                     subject: 'Reset Password'
                 };

                 apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                     console.log('API call successful. Email Sent. Returned data: ' + data);
                 }, function (error) {
                     console.error(error);
                 });

             })
             .catch(err => {
                 const error = new Error(err);
                 error.httpStatusCode = 500;
                 return next(error);
             });
     });
 };

 exports.getNewPassword = (req, res, next) => {
     const token = req.params.token;
     User.findOne({
             resetToken: token,
             resetTokenExpiryDate: {
                 $gt: Date.now()
             }
         })
         .then(user => {
             let message = req.flash('error');
             if (message.length > 0) {
                 message = message[0];
             } else {
                 message = null;
             }
             res.render('auth/reset-password', {
                 path: '/new-password',
                 pageTitle: 'New Password',
                 errorMessage: message,
                 userId: user._id.toString(),
                 passwordToken: token
             });
         })
         .catch(err => {
             const error = new Error(err);
             error.httpStatusCode = 500;
             return next(error);
         });
 };

 exports.postNewPassword = (req, res, next) => {
     const newPassword = req.body.password.toString();
     const confirmPassword = req.body.confirmPassword;
     const userId = req.body.userId;
     const passwordToken = req.body.passwordToken;
     let resetUser;

     User.findOne({
             resetToken: passwordToken,
             resetTokenExpiryDate: {
                 $gt: Date.now()
             },
             _id: userId
         })
         .then(user => {
             resetUser = user;
             return bcrypt.hash(newPassword, 12);
         })
         .then(hashedPassword => {
             resetUser.password = hashedPassword;
             resetUser.resetToken = undefined;
             resetUser.resetTokenExpiryDate = undefined;
             return resetUser.save();
         })
         .then(result => {
             res.redirect('/login');
         })
         .catch(err => {
             const error = new Error(err);
             error.httpStatusCode = 500;
             return next(error);
         });
 };