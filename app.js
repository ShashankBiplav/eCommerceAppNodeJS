// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false}));// this yields a middleware function to parse the incoming requests

app.use(adminRoutes);

app.use(shopRoutes);

// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);

