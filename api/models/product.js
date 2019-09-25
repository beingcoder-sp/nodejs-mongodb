const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true}, // Mark this property as required
    price: { type: Number, required: true} // Mark this property as required
});

module.exports = mongoose.model('Product', productSchema);