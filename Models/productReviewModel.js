const mongoose = require('mongoose');



const Review = mongoose.model('Review', {
    content : {type:String, require:[true, 'review content is required']},
    product : {type : mongoose.Types.ObjectId, ref:'Product'},
    reviewedBy : {type : mongoose.Types.ObjectId, ref:'User'},
})

module.exports = Review
