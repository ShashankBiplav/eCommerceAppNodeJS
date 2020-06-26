const fs = require('fs');
const path = require('path');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
       this.id = Math.random().toString();
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
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