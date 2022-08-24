const express = require('express');
const router = express.Router();
const isUserLoggedIn = require('../Middleware/auth');
const AddToCart = require('../Models/productAddToCartModel');
const Product = require('../Models/productModel');
const User = require('../Models/userModel');

// ====================== start add to cart ======================
router.post('/product/add-to-cart/:id', isUserLoggedIn.isUserLoggedIn, function(req,res)
{
    console.log("add to cart urt hitteeed");
    const productQuantity = req.body.productQuantity
    const cartAddedBy = req.uInfo._id
    const product = req.params.id
    
    


    const add_to_cart = new AddToCart({productQuantity:productQuantity,product:product, cartAddedBy:cartAddedBy})

    add_to_cart.save().then(function(result)
    {
        res.status(201).json({message:"product add to the cart successsfulley", success:true})

    })
    .catch(function(err)
    {
        res.status(500).json({message:err, success:false})
    })
});
// ====================== end add to cart ======================




// ====================== start update my cart item ======================
router.put('/update/my-cart-item/:id', isUserLoggedIn.isUserLoggedIn, function(req,res)
{
    const id = req.params.id
    const productQuantity = req.body.productQuantity
    // const cartAddedBy = req.uInfo._id
    // const product = req.params.id
    


    AddToCart.updateOne({_id : id},{productQuantity:productQuantity})  
    .then(function(result)
    {
        res.status(201).json({message:"my cart-item updated success successsfulley", success:true})

    })
    .catch(function(err)
    {
        res.status(500).json({message:err, success:false})
    })
});
// ====================== end update my cart item ======================




// ======================= start getting added products in cart ===================
router.get('/cart-item/:id', function(req, res)
{
    const productId = req.params.id

    AddToCart.find({product:productId}).then(function(data){
        res.status(200).json(data)
        // console.log('data log',data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})
// ======================= end getting added products in cart ===================



// ======================= start getting single cart item ===================
router.get('/cart-item/:id', function(req, res)
{
    const id  = req.params.id

    AddToCart.findOne({_id:id}).then(function(data)
    {
        res.status(200).json({data, success:true})
    })

    .catch(function(e)
    {
        res.status(500).json({error : e, success:false})
    })
});
// ======================= end getting start getting single cart item ===================





// ================ start getting already added product in cart ============
router.get('/already/added-cart-item/:id', isUserLoggedIn.isUserLoggedIn, function(req, res)
{
    const product = req.params.id
    const cartAddedBy = req.uInfo._id


    AddToCart.aggregate([{$match:{productId:product}}])
    .then(function(data){
        res.status(200).json({data, message:"already enrolled this course"})
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
});
// ================ end getting already added product in cart ============






// ============ start getting added products in cart by specific user =====================
router.get('/my-cart-item', isUserLoggedIn.isUserLoggedIn, function(req, res)
{
    const id = req.uInfo._id
    AddToCart.find({cartAddedBy:id}).populate("product").then(function(data)
    {
        res.status(200).json({data, success:true})

        console.log(data)
    })
    .catch(function(e)
    {
        res.status(500).json({error:e, success:false})
    })
});
// ============ end getting added products in cart by specific user =====================







// ============== start delete added products in cart ====================
router.delete('/delete/my-cart/:id', isUserLoggedIn.isUserLoggedIn, function(req, res)
{
    const id = req.params.id
    AddToCart.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({message:"my cart item deleted success" , success:true})
    })
    .catch(function(er)
    {
        res.status.json({message:er, success:false})
    })

});
// ============== end delete added products in cart ====================








// only use this api while user deleting account
// ======================= start delete cart item while user deleted ========================
router.delete('/my-cart-item/deleteOnAccount', isUserLoggedIn.isUserLoggedIn, function(req, res){
    const id = req.uInfo._id


    console.log(id)

    AddToCart.deleteMany({cartAddedBy : id}).then(function(){
        res.status(200).json({success : true, message : 'deleted all your cart item'})
    })
    .catch(function(err){
        res.status(500).json({success : false, message : err})
    })          
});
// ======================= end delete cart item while user deleted ========================



module.exports = router