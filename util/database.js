const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;


const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb+srv://shashankbiplav:eCommerceNodeJS@ecommercenodejs.dcwx8.mongodb.net/<dbname>?retryWrites=true&w=majority')
    .then(client => {
        console.log('success');
        callback(client);
    })
    .catch(err => console.log(err));
};

module.exports = mongoConnect;