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

exports.getProducts = (req, res, next) =>{
    Product.fetchAll((products)=>{
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products', // used in header
          path: '/admin/products', // to set active path
        });
      });
}
