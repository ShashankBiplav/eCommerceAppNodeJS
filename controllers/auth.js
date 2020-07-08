const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// const sendinBlue = require('nodemailer-sendinblue-transport');

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

// const transporter = nodemailer.createTransport(sendinBlue({
//     auth: {
//         apiKey: 'dCjEBqOkxrz6ADLH'
//     }
// }));

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
                    // res.redirect('/login');
                    //     transporter.sendMail({
                    //         to: email,
                    //         from: 'thesuperdroidhandler@gmail.com',
                    //         subject: 'Sign up Successful',
                    //         html: '<h1>Sign up successful</h1>'
                    //     }).catch(err=>console.log(err));




                    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
                        to: email,
                        from:'hi@thesuperdroid.com',
                        message: '<h1>Sign up successful</h1>'
                    }); // SendSmtpEmail | Values to send a transactional email

                    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                        console.log('API called successfully. Returned data: ' + data);
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

exports.getReset = (req, res, next)=>{
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