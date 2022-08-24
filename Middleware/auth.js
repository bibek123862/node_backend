const jwt = require('jsonwebtoken')

const Admin = require('../Models/adminModel')
const User = require('../Models/userModel')


// file auth.js

module.exports.isAdminLoggedIn = function(req, res, next)
{
    console.log('Admin test middleware')

    console.log('hello ', req.headers.authorization)

    const token = req.headers.authorization.split(' ')[1]
    console.log('Admin token',token)
    if (!token) {
        return res.status(401).send('Access denied')
    }
    try 
    {
        const checkAdminData = jwt.verify(token, 'secretkey')

        Admin.findOne({_id:checkAdminData.adminId})
        .then(function(adminInfo)
        {
            console.log('user information ',adminInfo)

            req.aInfo = adminInfo

            console.log(req.aInfo._id)
           // res.send(teacherinfo)
            next()
        })
       
        .catch(function(err)
        {
            res.status(401).json({message:"Please login as admin"})
            console.log('Invalid token console')
        })

        
    } catch (err) {
        res.status(500).json({error : err})
    }

};







module.exports.isUserLoggedIn = function(req, res, next)
{
    console.log('User test middleware')

    console.log('hello ', req.headers.authorization)

    const token = req.headers.authorization.split(' ')[1]
    console.log('User token',token)
    if (!token) {
        return res.status(401).send('Access denied')
    }
    try 
    {
        const checkUserData = jwt.verify(token, 'secretkey')

        User.findOne({_id:checkUserData.userId})
        .then(function(userInfo)
        {
            console.log('user information ',userInfo)

            req.uInfo = userInfo

            console.log(req.uInfo._id)
           // res.send(teacherinfo)
            next()
        })
       
        .catch(function(err)
        {
            res.status(401).json({message:"Please login"})
            console.log('Invalid token console')
        })

        
    } catch (err) {
        res.status(500).json({error : err})
    }

};



