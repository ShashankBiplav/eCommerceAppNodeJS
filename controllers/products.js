const Product = require('../models/product.js');

exports.getAddProductPage = (req, res, next)=>{
    res.render('admin/add-product', {
        pageTitle: 'Add Product', // used in header
        path: '/admin/add-product', // to set active path
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
      });
}

exports.postAddNewProduct = (req, res, next)=>{
    
    const product = new Product(req.body.title);
    product.save();
   res.redirect('/');
}

exports.getproducts= (req, res, next)=>{
  const products = Product.fetchAll((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop', // used in header
      path: '/', // to set active path
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
 
}