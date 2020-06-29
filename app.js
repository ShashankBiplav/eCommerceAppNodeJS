const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false}));// this yields a middleware function to parse the incoming requests
app.use(express.static(path.join(__dirname,'public')));// path created to access public directory

app.use('/admin',adminRoutes); //filtering the path via ->  /admin

app.use(shopRoutes);

app.use(errorController.get404page);
// const server = http.createServer(app);

// server.listen(3000);
sequelize.sync()
.then(result =>{
    // console.log(result);
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
});



