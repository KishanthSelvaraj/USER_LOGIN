const mongoose=require('mongoose')
 const empsch=new mongoose.Schema({
    firstName:String,
    lastName:String,
    phoneNumber:Number,
    dob:Date,
    email:{
      type:String,
      unique:true
    },
    password:String,
    confirmPassword:String,
 })
  
 const Empmodel=mongoose.model('employee',empsch)


 module.exports=Empmodel