const mongoose = require('mongoose');

const AddToCart = mongoose.model('AddToCart', {
    productQuantity :{type:String, required: true},
    product : {type : mongoose.Types.ObjectId, ref:'Product'},
    cartAddedBy : {type : mongoose.Types.ObjectId, ref:'User'},
});

module.exports = AddToCart;