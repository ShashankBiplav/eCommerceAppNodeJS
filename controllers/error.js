exports.get404page =(req, res, next)=>{
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404.ejs', { pageTitle: 'Page Not Found' , path:'/404'});
};