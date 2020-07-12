const path = require('path');

const express = require('express');

const expressValidator = require('express-validator');

const router = express.Router();

const adminController = require('../controllers/admin.js');

const isAuth = require('../middleware/is-auth.js');

//   /admin/add-product ->GET request
router.get('/add-product', isAuth,  adminController.getAddProductPage);

// /admin/products -> GET request
router.get('/products',isAuth, adminController.getProducts);


//   /admin/add-product ->POST request
router.post('/add-product',[
    expressValidator.check('title', 'Invalid title').isString().isLength({min:3}).trim(),
    expressValidator.check('price', 'Invalid price').isFloat(),
    expressValidator.check('description', 'Invalid description').isLength({min:10, max:500}).trim()
],isAuth,adminController.postAddNewProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProductPage);

router.post('/edit-product',[
    expressValidator.check('title','Invalid title').isString().isLength({min:3}).trim(),
    expressValidator.check('price', 'Invalid price').isFloat(),
    expressValidator.check('description', 'Invalid description').isLength({min:10, max:500}).trim()
],isAuth, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router; //  exporting all properties of router properties therefore this syntax
 