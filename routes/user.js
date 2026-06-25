const express = require('express')
const router = express.Router()
const {registerUser,loginUser,changePassword} = require('../controllers/user')
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')

router.get('/',authMiddleware,(req,res)=>{
    const {userId,username,role}= req.user
    res.status(200).json({
        message:'Welcome to Home Page.',
        userInfo:{
            userId:userId,
            username:username,
            role:role
        }
    })
})

router.get('/admin',authMiddleware,adminMiddleware,(req,res)=>{
    res.status(200).json({
        message:'Welcome to Admin Page.',
       
    })
})


// user-auth 
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/changepwd',authMiddleware,changePassword)

module.exports = router