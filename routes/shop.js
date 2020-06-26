const path = require('path');

const express = require('express');

const router = express.Router();

const shopController  = require('../controllers/shop.js');

router.get('/',shopController.getIndex);

router.get('/products',shopController.getproducts);

router.get('/cart',shopController.getCart);

router.get('/checkout',shopController.getCheckout);

module.exports = router;