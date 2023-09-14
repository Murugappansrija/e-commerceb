const { trusted } = require('mongoose')
const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')
const ErrorHandler = require('../utils/errorHandler')
const errorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
const crypto = require('crypto')

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

// forgot password= api/v1/password/forgot

exports.forgotPassword= catchAsyncError(async(req,res,next)=>{
  // const user =  await User.findOne({email: req.body.email})
  const user =  await User.findOne({email: req.body.email});
  if(!user){
    return next(new ErrorHandler('user not found this email id'))
  }
  const resetToken = user.getResetToken()
  await user.save({validateBeforeSave: false})
  //reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
  const message =` your password reset url is as follow \n\n ${resetUrl}\n\n if have not request this email, then ignore it`
try{
    sendEmail({
      email: user.email,
      subject:'art of tmilnadu recovery mail',
      message
    })
    res.status(200).json({
      success:true,
      message:`email sent to ${user.email}`
    })
}
catch(error){
 
     user.resetPasswordToken= undefined
     user.resetPasswordTokenExpire= undefined
     await user.save({validateBeforeSave:false})
     return next(new ErrorHandler(error.message),500)
}

})
//reset password = /api/v1/password/reset/:token-value
exports.resetPassword= catchAsyncError(async(req,res,next)=>{
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({resetPasswordToken,
      resetPasswordTokenExpire:{
        $gt:Date.now()
      }
    })
    if(!user){
      returnnext(new errorHandler('password reset token is invalid or expires'))
    }
    if(req.body.password !== req.body.confirmPassword){
      return next(new errorHandler('password does not match'))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined
    await user.save({validateBeforeSave:false})

    sendToken(user,201,res)
  }) 

  //get user profile - /api/v1//myprofile
  exports.getUserProfile= catchAsyncError(async(req,res,next)=>{
    const user =  await User.findById(req.user.id)
    res.status(200).json(
    {
      succes: true,
      user
    }
    )
  })

  //change password= api/v1/changepassword

  exports.changepassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password')
    //check old password
    if(!await user.isValidPassword(req.body.oldpassword)){
      return next(new errorHandler('old password is mismatch'))
    }
//asign a new password
user.password = req.body.password
await user.save()
res.status(200).json({
  success: true
})
  })

//updateProfile -
  exports.updateProfile = catchAsyncError(async(req,res,next)=>{
  const newUserData ={name: req.body.name, email: req.body.email}
  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
     runValidators:true
   })
   res.status(200).json({
    success: true,
    user
   })
  })


  //admin apiservicess

    // admin: get all users

   exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find()
  res.status(200).json({
    success:true,
    users
  })
  })

  //get single user :
  exports.getSingleUser= catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
      return next(new errorHandler(`user not found with this ${req.params.id}id`))
    }
    res.status(200).json({
      success: true,
      user
    })
  })

  //admin: update role

  exports.updateUser = catchAsyncError(async(req,res,next)=>{
    const newUserData = {email:req.body.email,name:req.body.name,role:req.body.role}
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
      new:true,
      runValidators:true
    })
    res.status(200).json({
      success:true,
      user
    })
  })
  
  //admin: delete user
  exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
      return next(new errorHandler(`user not found with this id ${req.params.id}`))
    }
    await user.deleteOne()
    res.status(200).json({
      success: true,
      message:'user removed'
    })
  })
