// const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path.js');

const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false}));// this yields a middleware function to parse the incoming requests
app.use(express.static(path.join(__dirname,'public')));// path created to access public directory

app.use('/admin',adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(rootDir,'views','404.html'));
});
// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);

