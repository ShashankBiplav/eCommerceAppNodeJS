const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodeJSeCommerce',
    password: '<Your root password here>'
});

module.exports = pool.promise();