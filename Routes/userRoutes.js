const express = require('express');
const User = require('../Models/userModel');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../Middleware/upload');
const isUserLoggedIn = require('../Middleware/auth');




// User Register

router.post('/account/register/user', upload.single('profilePicture'),
[
    check('username', 'required username').not().isEmpty(),
    check('email', 'Invalid Email Address').isEmail(),
    check('email', 'Invalid Email Address').not().isEmpty(),
    check('password', 'password is required').not().isEmpty()

], function(req,res)
{
    const errors = validationResult(req);

    console.log("url hitted");

    if (errors.isEmpty()) {
        const username = req.body.username
        const password = req.body.password
        const email = req.body.email

        bcryptjs.hash(password, 10, function(err, hash)
        {
            const addUser = new User({username:username, password:hash, 
                    email:email})  
                addUser.save()
            .then(function(result)
            {
                res.status(201).json({message : "Account registred success", success:true})
                console.log('user registred success')
            })
            .catch(function(err)
            {
                res.status(500).json({message:err})
                console.log('user regristration failed')
            })
        })  
    }
    else
    {
        res.status(400).json(errors.array());
    }   
});



// admin login
router.post('/account/login/user', function(req, res)
{
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)

    User.findOne({username : username})
    .then(function(userData)
    {
        if(userData === null)
        {
            return res.status(201).json({message : "Invalid login data", success:false})
        }

        bcryptjs.compare(password, userData.password, function(err, result)
        {
            if(result === false)
            {
                return res.status(201).json({message : "Invalid login data", success:false})
            }

            const token = jwt.sign({userId : userData._id}, 'secretkey')
            res.status(200).json({
                message : "Login Sucessful",
                token : token,
                success:true,
                userData:[userData],
                user:"User",
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




// user profile

router.get('/account/user/profile', isUserLoggedIn.isUserLoggedIn, function(req, res){
    const id = req.uInfo._id
    User.findOne({_id : id}).then(function(data){
        res.status(200).json(data)
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
});




// User profile update
router.put('/account/user/update', isUserLoggedIn.isUserLoggedIn, upload.single('profilePicture'), function(req, res)
{
    const id = req.uInfo._id
    const username = req.body.username
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const address = req.body.address
    // const profilePicture = req.file.path


    User.updateOne({_id:id}, {username:username, email:email, firstName:firstName,
                        lastName:lastName, address:address})
    .then(function(result)
    {
        console.log(result)
        res.status(200).json({ message : "User profile successfully updated", success : true })
    })
    .catch(function(e){
        res.status(500).json({error : e, success:false})
    })

});




// User pernamently delete account

router.delete('/account/user/delete', isUserLoggedIn.isUserLoggedIn, function(req, res)
{
    const id = req.uInfo._id
    User.deleteOne({_id:id}).then(function(result)
    {
        res.status(200).json({ message : "user account successfully deleted", success:true })
    })
    .catch(function(er){
        res.status(500).json({ message : er, success:false })
    })
});




module.exports = router;
