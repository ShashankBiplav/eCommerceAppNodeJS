// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false}));// this yields a middleware function to parse the incoming requests

app.use('/admin',adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use((req, res, next)=>{
    res.status(404).send('<h1>Page Not Found</h1>');
});
// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);

