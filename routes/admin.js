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

router.get('/edit-product/:productId', adminController.getEditProductPage);

router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router; //  exporting all properties of router properties therefore this syntax
 