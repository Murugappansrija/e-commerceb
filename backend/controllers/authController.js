const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')
const ErrorHandler = require('../utils/errorHandler')
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

// forgot password= api/v1/password/forgot

exports.forgotPassword= catchAsyncError(async(req,res,next)=>{
  const user =  await User.findOne({email:req.body.email})
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