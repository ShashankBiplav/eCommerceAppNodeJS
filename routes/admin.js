const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path.js');

const products = []; // temporary array to keep data

//   /admin/add-product ->GET request
router.get('/add-product',(req, res, next)=>{
    // console.log('In add-product middleware');
    // //TODO: Send response
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
      });
});

//   /admin/add-product ->POST request
router.post('/add-product',(req, res, next)=>{
    products.push({title: req.body.title});  // pushing data into products array 
    console.log('In product middleware');
    console.log(req.body.title);
    
   res.redirect('/');
});

exports.routes = router; //  exporting two properties therefore this syntax
exports.products = products;