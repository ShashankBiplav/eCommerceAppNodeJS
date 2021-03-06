const Product = require('../models/product.js');

const fileHelper = require('../util/file.js');

const expressValidator = require('express-validator');
const product = require('../models/product.js');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product', // used in header
    path: '/admin/add-product', // to set active path
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddNewProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  console.log(image);
  if (!image) { // checking if the file attached is an image
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: {
        title: title,
        description: description,
        price: price
      },
      hasError: true,
      errorMessage: 'The file is not an image !',
      validationErrors: []
    });
  }
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) { // checking for other input errors
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: {
        title: title,
        description: description,
        price: price
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const imageUrl = image.path; //constructing image path for storing in DB
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product.save().then(result => { // save method automatically provided by mongoose
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => {
      // console.log(err);
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        description: updatedDesc,
        price: updatedPrice,
        _id: prodId
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId).then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save()
        .then(result => {
          console.log('Product updated successfully');
          res.redirect('/admin/products');
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({
      userId: req.user._id
    })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products', // used in header
        path: '/admin/products', // to set active path
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({
        _id: prodId,
        userId: req.user._id
      })
    })
    .then(() => {
      console.log('product deleted successfully');
      res.status(200).json({message: 'Success'});
    })
    .catch(err => {
      res.status(500).json({message:'Deleting product failed'});
    });
};