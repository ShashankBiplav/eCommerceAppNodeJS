const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.js');


//   /admin/add-product ->GET request
router.get('/add-product', adminController.getAddProductPage);

// /admin/products -> GET request
router.get('/products', adminController.getProducts);


//   /admin/add-product ->POST request
router.post('/add-product',adminController.postAddNewProduct);

module.exports = router; //  exporting two properties therefore this syntax
 