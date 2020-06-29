const db = require('../util/database.js');

const Cart = require('./cart.js');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save() { // return the promise that db.execute yields because it is async function
       return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.description, this.imageUrl]);
    }

    static deleteById(id) {
        
      }

    static fetchAll() { //this is async code so use a callback
       return db.execute('SELECT * FROM products');
    }
    static findById(id){
      return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);
    }
}