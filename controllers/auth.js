const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("5f0037429d3526136280ac57")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => {
            console.log(err)
        });
};