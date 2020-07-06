const path = require('path');

const express = require('express');

const router = express.Router();

const shopController  = require('../controllers/shop.js');

const isAuth = require('../middleware/is-auth.js');

router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart',isAuth,shopController.getCart);

router.post('/cart',isAuth, shopController.postCart);

router.post('/cart-delete-item',isAuth, shopController.postCartDeleteProduct);

// router.get('/checkout',shopController.getCheckout);

router.post('/create-order',isAuth, shopController.postOrder);

router.get('/orders',isAuth, shopController.getOrders);

module.exports = router;