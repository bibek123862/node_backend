const express = require('express');
const Admin = require('../Models/adminModel');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../Middleware/upload');
const isAdminLoggedIn = require('../Middleware/auth');

// Admin Register

router.post('/account/register/admin', upload.single('profilePicture'),
[
    check('username', 'required username').not().isEmpty(),
    check('email', 'Invalid Email Address').isEmail(),
    check('email', 'Invalid Email Address').not().isEmpty(),
    check('password', 'password is required').not().isEmpty()

], function(req,res)
{
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const username = req.body.username
        const password = req.body.password
        const email = req.body.email

        bcryptjs.hash(password, 10, function(err, hash)
        {
            const addAdmin = new Admin({username:username, password:hash, 
                    email:email})  
                addAdmin.save()
            .then(function(result)
            {
                res.status(201).json({message : "Account registred success", success:true})
                console.log('admin registred success')
            })
            .catch(function(err)
            {
                res.status(500).json({message:err})
                console.log('Admin regristration failed')
            })
        })  
    }
    else
    {
        res.status(400).json(errors.array());
    }   
});



// admin login
router.post('/account/login/admin', function(req, res)
{
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)

    Admin.findOne({username : username})
    .then(function(adminData)
    {
        if(adminData === null)
        {
            return res.status(201).json({message : "Invalid login data", success:false})
        }

        bcryptjs.compare(password, adminData.password, function(err, result)
        {
            if(result === false)
            {
                return res.status(201).json({message : "Invalid login data", success:false})
            }

            const token = jwt.sign({adminId : adminData._id}, 'secretkey')
            res.status(200).json({
                message : "Login Sucessful",
                token : token,
                success:true,
                adminData:[adminData],
                user:"Admin",
                username : req.body.username
            })
            console.log(token)
        })
    })
    .catch(function(err)
    {
        res.status(500).json({message:err})
    })
});





// admin profile

router.get('/account/admin/profile', isAdminLoggedIn.isAdminLoggedIn, function(req, res){
    const id = req.aInfo._id
    Admin.findOne({_id : id}).then(function(data){
        res.status(200).json(data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
});




// admin profile update
router.put('/account/admin/update', isAdminLoggedIn.isAdminLoggedIn, upload.single('profilePicture'), function(req, res)
{
    const id = req.aInfo._id
    const username = req.body.username
    const email = req.body.email
    const profilePicture = req.file.path


    Admin.updateOne({_id:id}, {username:username, email:email, profilePicture:profilePicture})
    .then(function(result)
    {
        console.log(result)
        res.status(200).json({ message : "Admin profile successfully updated", success : true })
    })
    .catch(function(e){
        res.status(500).json({error : e, success:false})
    })

});




// admin pernamently delete account

router.delete('/account/admin/delete', isAdminLoggedIn.isAdminLoggedIn, function(req, res)
{
    const id = req.aInfo._id
    Admin.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({ message : "admin account successfully deleted", success:true })
    })
    .catch(function(er){
        res.status(500).json({ message : er, success:false })
    })
});



module.exports = router;
