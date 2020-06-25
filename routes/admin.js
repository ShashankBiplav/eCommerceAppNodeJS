const path = require('path');

const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products.js');


//   /admin/add-product ->GET request
router.get('/add-product', productsController.getAddProductPage);

//   /admin/add-product ->POST request
router.post('/add-product',productsController.postAddNewProduct);

module.exports = router; //  exporting two properties therefore this syntax
 