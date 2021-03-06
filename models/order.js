const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        email: {
            type: String,
            required: true
        },
    }
});

module.exports = mongoose.model('Order', orderSchema);