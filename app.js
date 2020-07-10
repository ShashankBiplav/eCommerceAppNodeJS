//mongoDB password : eCommerceNodeJS

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error.js');

const User = require('./models/user.js');

const MONGODB_URI = 'mongodb+srv://shashankbiplav:eCommerceNodeJS@ecommercenodejs.dcwx8.mongodb.net/eCommerceNodeJS?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');
const { use } = require('./routes/admin.js');

app.use(bodyParser.urlencoded({
    extended: false
})); // yields a middleware function to parse the incoming requests
app.use(express.static(path.join(__dirname, 'public'))); // path created to access public directory

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next)=>{ // provided by express
    // .locals attaches to every res because they only exist in views that are rendered
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req,res,next) =>{
    if (!req.session.user) {
       return next(); 
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user =  user;
            next();
        })
        .catch(err => {
            next(new Error(err)); // inside async codes use this way of error handling instead
        });
});
    
app.use('/admin', adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use(authRoutes);

app.use('/500',errorController.get500page);

app.use(errorController.get404page);

app.use((error, req, res, next)=>{
    res.status(500).render('500.ejs', {
        pageTitle: 'Error !',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose.connect(MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));