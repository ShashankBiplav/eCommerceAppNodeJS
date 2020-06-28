const fs = require('fs');
const path = require('path');
const Cart = require('./cart.js');

const rootDir = require('../util/path.js');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
    
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            // return[];
            return callback([]);
        } else {
            callback(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
        getProductsFromFile((products) => {
            if (this.id) {
              const existingProductindex = products.findIndex(prod =>prod.id === this.id); 
              const updatedProducts = [...products];
              updatedProducts[existingProductindex] = this;
              fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
            });
            }else{
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
          const product = products.find(prod => prod.id === id);
          const updatedProducts = products.filter(prod => prod.id !== id);
          fs.writeFile(p, JSON.stringify(updatedProducts), err => {
            if (!err) {
              Cart.deleteProduct(id, product.price);
            }
          });
        });
      }

    static fetchAll(callback) { //this is async code so use a callback
        getProductsFromFile(callback);
    }
    static findById(id, callback){
        getProductsFromFile((products)=>{
            const product = products.find((prod)=> prod.id === id);
            callback(product);
        });
    }
}