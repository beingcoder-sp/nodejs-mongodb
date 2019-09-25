const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true }, // Connect order with the Product
    quantity: { type: Number, default: 1} // if nothing is passed it will take default as 1
});

module.exports = mongoose.model('Order', orderSchema);