const Product = require('../models/product.js');


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products', // used in header
        path: '/products', // to set active path
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({where:{id: prodId}})
  // .then(products =>{
  //   res.render('shop/product-detail', {
  //     product: products[0],
  //     pageTitle: products[0].title,
  //     path: '/products'
  //   });
  // })
  // .catch(err=>{
  //   console.log(err);
  // });
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop', // used in header
        path: '/', // to set active path
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getCart = (req, res, next) => {
  // console.log(req.user.cart);
  req.user.getCart()
    .then(cart => {
      console.log(cart);
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      console.log(err)
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: productId
        }
      });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) { //if we have existing product in the cart then increase quantity
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      //if we add product in the cart for the first time
      return Product.findByPk(productId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity
        }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //deleting cart item from the connected table
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({
        where: {
          id: prodId
        }
      });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result=>{
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next)=>{
  let fetchedCart;
  req.user.getCart()
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts();
  })
  .then(products=>{
    return req.user
    .createOrder()
    .then(order =>{
     return order.addProducts(products.map(product=>{
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }));
    })
    .catch(err=> console.log(err));
  })
  .then(result=>{
    return fetchedCart.setProducts(null); //cleaning the cart after placing the order
  })
  .then(result=>{
    res.redirect('/orders');
  })
  .catch(err=> console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']})
  .then(orders=>{  
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your orders',
    orders:orders
  });
  })
  .catch(err =>console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};