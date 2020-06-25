const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path.js');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }
    save() {
        // products.push(this);
        const p = path.join(rootDir,'data','products.json');
        fs.readFile(p,(error, fileContent)=>{
            let products =[];
            if (!error) {
                products =JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products),(err)=>{
                console.log(err);
            });
        });
            
    }
    static fetchAll() {
        const p = path.join(rootDir,'data','products.json');
        fs.readFile(p, (err, fileContent)=>{
            if (err) {
                return[];
            }
            return JSON.parse(fileContent);
        });
        // return products;
    }
}