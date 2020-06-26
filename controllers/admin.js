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
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
   const product = new Product(title, imageUrl, description, price);
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
