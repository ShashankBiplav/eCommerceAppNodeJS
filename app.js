//mongoDB password : eCommerceNodeJS

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');

const mongoConnect = require('./util/database.js').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({
    extended: false
})); // yields a middleware function to parse the incoming requests
app.use(express.static(path.join(__dirname, 'public'))); // path created to access public directory

app.use((req, res, next)=>{
    // User.findByPk(1).then(user=>{
    //     req.user= user;
    //     next();
    // }).catch(err=>{console.log(err)}); 
    next();   
});

app.use('/admin', adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use(errorController.get404page);

mongoConnect(()=>{
    app.listen(3000);
});