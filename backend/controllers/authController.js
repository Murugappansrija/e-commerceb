const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const errorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')

//registration : /api/v1/register

exports.registorUser = catchAsyncError (async(req,res,next)=>{
   const {name, email, password, avatar}= req.body
     const user = await User.create({
        name,
        email,
        password,
        avatar
     })
     sendToken(user,201,res)
})
//login : /api/v1/login

exports.loginUser = catchAsyncError (async(req,res,next)=>{
   const{email,password} = req.body
   if(!email || !password){
   return next(new errorHandler('please enter email & password',400))
   }
 const user =   await User.findOne({email}).select('+password')
 if(!user){
   return next(new errorHandler('invalid email or password',401))
 }
 if(!await user.isValidPassword(password)){
   return next(new errorHandler('invalid email or password',401))
 }
 sendToken(user,201,res)
})
     
//logout= api/v1/logout

exports.logoutUser = (req,res,next)=>{

  res.cookie('token',null,{
    expires: new Date(Date.now()),
    httpOnly: true
  }).status(200).json({
    succes:true,
    message:'loged out'
  })
}