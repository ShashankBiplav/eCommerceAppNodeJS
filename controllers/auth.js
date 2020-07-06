const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("5f0037429d3526136280ac57")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err)=>{
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postSignup = (req,res, next) => {}

exports.postLogout = (req,res,next) => {
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
}