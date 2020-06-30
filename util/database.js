const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeJSeCommerce', 'root', '<Your root password here>', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;