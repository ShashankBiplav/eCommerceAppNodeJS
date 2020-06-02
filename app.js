// const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false}));// this yields a middleware function to parse the incoming requests
app.use(express.static(path.join(__dirname,'public')));// path created to access public directory

app.use('/admin',adminRoutes.routes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use((req, res, next)=>{
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});
// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);

