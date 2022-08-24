const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const Product = require('../Models/productModel');
const Admin = require('../Models/adminModel');
const isAdminLoggedIn = require('../Middleware/auth');
const upload = require('../Middleware/upload');

// ================= start product insert==============================
router.post('/create/product', 
isAdminLoggedIn.isAdminLoggedIn,
upload.single('productThumbnail'),
[
    check('productName', 'required product name').not().isEmpty(),
    check('productDesc', 'required product description').not().isEmpty()
],
function(req, res)
{
    console.log(req.files)

    const errors = validationResult(req);
    if (errors.isEmpty()){
        const adminId = req.aInfo._id
        const productName = req.body.productName
        const productDesc = req.body.productDesc
        const productThumbnail = req.file.path
        const productDisplayPrice = req.body.productDisplayPrice
        const productActualPrice = req.body.productActualPrice

        const product = new Product({ productName:productName, productDesc:productDesc, productThumbnail:productThumbnail,
                productDisplayPrice:productDisplayPrice, productActualPrice:productActualPrice, adminId : adminId })
        
        console.log("kina",productName)
        
        product.save().then(function(result)
        {
            res.status(201).json({message:"product inserted", success:true})

        })
        .catch(function(err)
        {
            res.status(500).json({message:err, success:false})
        })
    }
    else
    {
        res.status(400).json(errors.array());
        console.log("fail")
    }
});

// ================= end product insert==============================






// =================== start getting all product list =================================
router.get('/products/list', function(req, res)
{
    console.log("url hitted");
    Product.find().then(function(data)
    {
        res.status(200).json({data, success:true})
    })
    .catch(function(e)
    {
        res.status(500).json({error:e, success:false})
    })
})

// =================== end getting all product list =================================


// ================================= start updating product details =============================
router.put('/product/update/:id', 
isAdminLoggedIn.isAdminLoggedIn,
upload.single('productThumbnail'),
function(req, res)
{
    console.log(req.files)

    
    const id = req.params.id
    console.log('updating data ', id);

    const adminId = req.aInfo._id
    const productName = req.body.productName
    const productDesc = req.body.productDesc
    const productThumbnail = req.file.path
    const productDisplayPrice = req.body.productDisplayPrice
    const productActualPrice = req.body.productActualPrice

    Product.updateOne({_id : id},{productName:productName, productDesc:productDesc, productThumbnail:productThumbnail,
                productDisplayPrice:productDisplayPrice, productActualPrice:productActualPrice })  
    .then(function(result)
    {
        res.status(200).json({message:"Product updated", success : true})
    })
    .catch(function(e)
    {
        res.status(500).json({error:e})
        console.log('errrroooooorrrrr');
    })
});

// ================================= end updating product details =============================






// ======================= start getting single product =============================

router.get('/product/:id', function(req, res)
{
    const id  = req.params.id

    Product.findOne({_id:id}).then(function(data)
    {
        res.status(200).json(data)
    })

    .catch(function(e)
    {
        res.status(500).json({error : e, success:false})
    })
});
// ======================= start getting single product =============================





// ======================= start deleting single product =============================

router.delete('/product/delete/:id', isAdminLoggedIn.isAdminLoggedIn, function(req, res)
{
    const id = req.params.id
    Product.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({message:"product deleted success" , success:true})
    })
    .catch(function(er)
    {
        res.status.json({message:er, success:false})
    })
});

// ======================= end deleting single product =============================


// ================ if system has multiple admins =================================
// ============= start getting product by specific admin =======================
router.get('/get/admin/product', isAdminLoggedIn.isAdminLoggedIn, function(req, res)
{
    const id = req.aInfo._id;
    Product.find({adminId : id}).then(function(data){
        res.status(200).json(data)
        // console.log('data log',data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
});
// ============= end getting product by specific admin =======================



// only use this api while admin deleting account
// ======================= start delete product while admin deleted ========================
router.delete('/product/deleteOnAccount', isAdminLoggedIn.isAdminLoggedIn, function(req, res){
    const id = req.aInfo._id

    console.log(req.aInfo.username)
    console.log(req.aInfo._id)

    console.log(id)

    Product.deleteMany({adminId : id}).then(function(){
        res.status(200).json({success : true, message : 'deleted all your products'})
    })
    .catch(function(err){
        res.status(500).json({success : false, message : err})
    })          
});
// ======================= end delete product while admin deleted ========================



module.exports = router