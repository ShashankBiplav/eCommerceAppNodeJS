const fs = require('fs');

const path = require('path');

const rootDir = require('../util/path.js');
const { json } = require('body-parser');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart{
    static addProduct(id, productPrice){
        fs.readFile(p,(err, fileContent)=>{
            //Fetch the previous cart or create a new one-if no cart is available
            let cart = {products:[], totalPrice:0.0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            //Analyze the cart and find existing carts
            const existingProductIndex = cart.products.findIndex(prod=>prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //Add new product or increase the quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                updatedProduct = {id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;// extra + to convert price to number
            fs.writeFile(p,JSON.stringify(cart), (err)=>{
                console.log(err);
            });
        });
    }
    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent)=>{
            if (err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.findIndex((prod)=>prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter((prod)=> prod.id!== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice*productQty;
            fs.writeFile(p,JSON.stringify(updatedCart),err =>{
                console.log(err);
            });
        });
    }
    static getCart(cb){
        fs.readFile(p,(err, fileContent)=>{
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            }else{
                cb(cart);
            }
        });
    }
}