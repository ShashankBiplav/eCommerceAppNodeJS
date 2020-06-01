// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));// this yields a middleware function to parse the incoming requests

app.use('/add-product',(req, res, next)=>{
    console.log('In another middleware');
    //TODO: Send response
    res.send('<form action ="/products" method ="POST"><input type = "text" name ="title"><button type ="submit">Add Product</button></form>');
});

app.use('/products',(req, res, next)=>{
    console.log('In product middleware');
    console.log(req.body);
    
   res.redirect('/');
});

app.use('/',(req, res, next)=>{
    console.log('In default middleware');
    //TODO: Send response
    res.send('<h1> Hello from NodeJS via express</h1>');
});

// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);

