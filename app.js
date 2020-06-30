const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');

const sequelize = require('./util/database');

const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js');
const CartItem = require('./models/cart-item.js');
const Order = require('./models/order.js');
const OrderItem = require('./models/order-item.js');

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
    User.findByPk(1).then(user=>{
        req.user= user;
        next();
    }).catch(err=>{console.log(err)});    
});

app.use('/admin', adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use(errorController.get404page);
// const server = http.createServer(app);

//declaring relation between product and user, user is a seller, onDelete is cascade because when a user is deleted 
//the products owned by him is also deleted from DB
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

//associating user with cart model and cart to Product
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart, {through:CartItem});

//associating order models   one to many relationship
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

// server.listen(3000);
sequelize.sync() //sequelize.sync({force: true}) , set force: true to overwrite the existing table in DB
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            User.create({name: 'Shashank', email: 'shashankbiplav@gmail.com'});
        }
        return user;
    })
    .then(user =>{
        // console.log(user);
        return user.createCart();
    })
    .then(cart=>{
        // console.log(cart);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });