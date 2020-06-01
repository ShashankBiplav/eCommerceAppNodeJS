// const http = require('http');

const express = require('express');

const app = express();

app.use('/add-product',(req, res, next)=>{
    console.log('In another middleware');
    //TODO: Send response
    res.send('<h1> Add products page</h1>');
});


app.use('/',(req, res, next)=>{
    console.log('In another middleware');
    //TODO: Send response
    res.send('<h1> Hello from NodeJS via express</h1>');
});

// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);

