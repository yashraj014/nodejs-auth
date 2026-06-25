const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const registerUser = async(req,res) =>{
   try {
    const {username,email,password,role}=req.body;
    const existingUser = await User.findOne({$or:[{username},{email}]});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is already exists either with same username or same email.' 
        })
    } 

    const hashedPassword = await bcrypt.hash(password,12)
    const newUser = await User.create({
        username,
        email,
        password:hashedPassword,
        role:role
    })
   
    res.status(201).json({
        user:newUser
    });
       
   } catch (error) {
    return res.status(500).json({
        success:false,
        message:'Some error occured!!',
        error:error.message
    })
   }
}

const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser){
           return res.status(400).json({message:"Invalid Credentials"});
        }
        const isPasswordMatch = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordMatch){
           return res.status(400).json({message:"Invalid Credentials"});
        }
//  Create token

    const accessToken = jwt.sign({
        userId:existingUser._id,
        username:existingUser.username,
        role:existingUser.role
    },process.env.SECRET_KEY,{
        expiresIn:'15m'
    })
        return res.status(200).json({
            success:true,
            accessToken
        })

    } catch (error) {
        return res.status(500).json({
        success:false,
        message:'Some error occured!!',
        error:error.message
    })
    }
}
// Change password

const changePassword = async(req,res)=>{
    const {oldPassword,newPassword} = req.body;

    const userId= req.user.userId;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message:'user not found'
        })
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({
            message:'password does not match, try again!'
        })
    }
    const hashedPassword = await bcrypt.hash(newPassword,12);

    user.password=hashedPassword;
    await user.save();

    return res.status(200).json({
        message:'Password changed successfully.'
    })

}
module.exports = {
    registerUser,
    loginUser,
    changePassword
}