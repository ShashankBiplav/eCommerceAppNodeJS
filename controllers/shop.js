const Product = require('../models/product.js');


exports.getproducts= (req, res, next)=>{
  const products = Product.fetchAll((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products', // used in header
      path: '/products', // to set active path
    });
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop', // used in header
      path: '/', // to set active path
    });
  });
}

exports.getCart = (rew,res,next) =>{
  res.render('shop/cart',{
    path: '/cart',
    pageTitle:'Your Cart'
  });
}

exports.getCheckout = (rew, res, next) =>{
  res.render('shop/checkout',{
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}