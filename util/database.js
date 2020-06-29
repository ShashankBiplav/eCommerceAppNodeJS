const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeJSeCommerce', 'root', 'Blackzea@77', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;