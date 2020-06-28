const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodeJSeCommerce',
    password: 'xxxxxxxxx'
});

module.exports = pool.promise();