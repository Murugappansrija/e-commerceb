const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required: [true, "please enter name"]
    },
    email:{
        type : String,
        required: [true, "please enter email id"],
        unique: true,
        validate :[validator.isEmail,'please enter valid email address'],
        select : false
    },
    password:{
        type : String,
        required: [true, "please enter password"],
        maxlength :[8, 'password length cannot exceed 8 charector'],
        select:false
    },
    avatar:{
        type : String,
        required : true

    },
    role:{
         type:String,
         default : 'user'
    },
    resetPasswordToken : String,
    resetPasswordTokenExpire:Date,
    createdAt:{
        type: Date,
        default: Date.now
    }


})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
}
    this.password = await bcrypt.hash(this.password,10)
})
userSchema.methods.getJwtToken = function(){
   return jwt.sign({id: this.id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_TIME
    })
}
userSchema.methods.isValidPassword = async function(enteredPassword){
    // if(!this.isModified('password')){
    //          next()
    // }
   return  await bcrypt.compare(enteredPassword,this.password)
}
//reset password
userSchema.methods.getResetToken= function(){
  //generate token
 const token = crypto.randomBytes(20).toString('hex')
 this.resetPasswordToken=crypto.createHash('sha256').update(token).digest('hex')
 this.resetPasswordTokenExpire = Date.now()+30*60*1000
 return token
}
let model =mongoose.model('User',userSchema)
module.exports= model