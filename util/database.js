const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeJSeCommerce', 'root', '<Your root pasword>', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;