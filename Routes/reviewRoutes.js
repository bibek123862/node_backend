const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const Product = require('../Models/productModel');
const Review = require('../Models/productReviewModel')
const isUserLoggedIn = require('../Middleware/auth');




// Creating Review

router.post('/review/product/:id', isUserLoggedIn.isUserLoggedIn,  function(req, res)
{
    const content = req.body.content
    const product = req.params.id
    const reviewedBy = req.uInfo._id

    const review = new Review({content:content, product:product, reviewedBy:reviewedBy})

    review.save().then(function(result)
    {
        res.status(201).json({message:"product reviewed successsfulley"})

    })
    .catch(function(err)
    {
        res.status(500).json({message:err})
    })
})


router.get('/reviews/:id', function(req, res)
{
    const productId = req.params.id

    Review.find({product:productId}).populate('reviewedBy'). then(function(data){
        res.status(200).json(data)
        // console.log('data log',data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})


router.delete('/reviews/deleteOnAccount', isUserLoggedIn.isUserLoggedIn, function(req, res){
    const id = req.uInfo._id


    Review.deleteMany({reviewedBy : req.uInfo._id}).then(function(){
        res.status(200).json({success : true, message : 'deleted all review'})
    })
    .catch(function(err){
        res.status(500).json({success : false, message : err})
    })          
})



module.exports = router