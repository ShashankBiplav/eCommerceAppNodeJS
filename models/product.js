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
    constructor(title) {
        this.title = title;
    }
    save() {
        // products.push(this);
        // const p = path.join(rootDir,'data','products.json');
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
}