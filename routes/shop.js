const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path.js');

const adminRoutes = require('./admin'); //to access the temporary product array

router.get('/',(req, res, next)=>{
    // console.log('In default middleware');
    // //TODO: Send response
    // console.log(adminRoutes.products);// seeing products in path '/'
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    const products = adminRoutes.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
});

module.exports = router;