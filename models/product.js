const getDb = require('../util/database.js').getDb;

class Product{
  constructor(title, price, description, imageUrl){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  save(){
    const db =  getDb();
   return db.collection('products').insertOne(this)
    .then(result =>{
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  }
  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products=>{
      console.log(products);
      return products;
    })
    .catch(err=>console.log(err)); //only use toArray() when the quantity is small
    //implement pagination methodologyh later
  }
}

module.exports = Product;