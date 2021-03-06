exports.get404page = (req, res, next) => {
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404.ejs', {
        pageTitle: 'Page Not Found',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500page = (req, res, next) => {
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(500).render('500.ejs', {
        pageTitle: 'Error !',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
};