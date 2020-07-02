
const Product = require('../models/product.js');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product', // used in header
    path: '/admin/add-product', // to set active path
    editing: false,
  });
};

exports.postAddNewProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product =new Product(title, price, description, imageUrl);
    product.save().then(result => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product => {
    
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product', // used in header
      path: '/admin/edit-product', // to set active path
      editing: editMode,
      product: product,
    });
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
      const product =new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId);
    product.save().then(result => {
      console.log('Product updated successfully');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products', // used in header
        path: '/admin/products', // to set active path
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('product deleted successfully');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};