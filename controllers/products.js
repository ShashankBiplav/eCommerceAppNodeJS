const products = []; // temporary array to keep data

exports.getAddProductPage = (req, res, next)=>{
   //fetching data from products array
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
      });
}

exports.postAddNewProduct = (req, res, next)=>{
    products.push({title: req.body.title});  // pushing data into products array 
    console.log('In product middleware');
    console.log(req.body.title);
    
   res.redirect('/');
}

exports.getproducts= (req, res, next)=>{
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
}