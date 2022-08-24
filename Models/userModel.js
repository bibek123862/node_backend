
const mongoose = require('mongoose');


// creating mongoose collection for user

const User = mongoose.model('User', {
    username:{type:String, required: true, unique: true},
    password:{type:String, required: true, minlength: 6},
    email:{type:String, required: true, unique: true},
    firstName:{type:String},
    lastName:{type:String},
    address:{type:String},
    is_active:{type:Boolean, default:true},
    profilePicture:{type:String, default:'media/profilePicture.png'},
    createdAt: {type: Date, default: Date.now}
})



module.exports = User
