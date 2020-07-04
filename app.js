//mongoDB password : eCommerceNodeJS

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error.js');

// const User = require('./models/user.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({
    extended: false
})); // yields a middleware function to parse the incoming requests
app.use(express.static(path.join(__dirname, 'public'))); // path created to access public directory

// app.use((req, res, next) => {
//     User.findById("5efee95755793a24e8e4f6b9").then(user => {
//         req.user = new User(user.name, user.email, user.cart, user._id);
//         next();
//     }).catch(err => {
//         console.log(err)
//     });
// });

app.use('/admin', adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use(errorController.get404page);

mongoose.connect('mongodb+srv://shashankbiplav:eCommerceNodeJS@ecommercenodejs.dcwx8.mongodb.net/eCommerceNodeJS?retryWrites=true&w=majority',
// {useUnifiedTopology:true, useNewUrlParser: true}
)
    .then(app.listen(3000))
    .catch(err => console.log(err));