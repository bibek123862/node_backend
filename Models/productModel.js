const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
    productName : {type:String, require:[true, 'product name required']},
    productDesc : {type:String, require:[true, 'product desc is required']},
    productThumbnail: {type:String},
    productDisplayPrice : {type:Number, require:[true], default:0.00},
    productActualPrice :{type:Number, require:[true], default:0.00},
    adminId: {type : mongoose.Types.ObjectId, ref:'Admin'},
    createdAt: {type: Date, default: Date.now}
})

module.exports = Product