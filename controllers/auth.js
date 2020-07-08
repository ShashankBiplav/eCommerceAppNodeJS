 const crypto = require('crypto');

 const bcrypt = require('bcryptjs');

 const User = require('../models/user.js');


 var SibApiV3Sdk = require('sib-api-v3-sdk');
 var defaultClient = SibApiV3Sdk.ApiClient.instance;
 // Configure API key authorization: api-key
 var apiKey = defaultClient.authentications['api-key'];
 apiKey.apiKey = "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"
 // Configure API key authorization: partner-key
 var partnerKey = defaultClient.authentications['partner-key'];
 partnerKey.apiKey = "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"
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
         errorMessage: message
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
         errorMessage: message
     });
 };

 exports.postLogin = (req, res, next) => {
     const email = req.body.email;
     const password = req.body.password;
     User.findOne({
             email: email
         })
         .then(user => {
             if (!user) {
                 req.flash('error', 'Invalid email or password.');
                 return res.redirect('/login');
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
                     res.redirect('/login');
                 })
                 .catch(err => {
                     console.log(err);
                     res.redirect('/login');
                 });
         })
         .catch(err => {
             console.log(err)
         });
 };

 exports.postSignup = (req, res, next) => {
     const email = req.body.email;
     const password = req.body.password;
     const confirmPassword = req.body.confirmPassword;
     User.findOne({
             email: email
         })
         .then((userDoc) => {
             if (userDoc) {
                 req.flash('error', 'Email already exists');
                 return res.redirect('/signup');
             }
             return bcrypt
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
                     //     transporter.sendMail({
                     //         to: email,
                     //         from: 'thesuperdroidhandler@gmail.com',
                     //         subject: 'Sign up Successful',
                     //         html: '<h1>Sign up successful</h1>'
                     //     }).catch(err=>console.log(err));


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
                     }, function (error) {
                         console.error(error);
                     });


                 });
         })
         .catch(err => console.log(err));
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
             .catch(err => console.log(err));
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
         .catch(err => console.log(err));
 };

 exports.postNewPassword = (req, res, next) => {
     const newPassword = req.body.password.toString();
     const confirmPassword = req.body.confirmPassword;
     const userId = req.body.userId;
     const passwordToken = req.body.passwordToken;
     let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiryDate: { $gt: Date.now() },
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
      console.log(err);
    });
 };