const mongoose = require('mongoose')
require('../../config/DBconnection')

const userSchema = new mongoose.Schema({
username:{type:String,required:true},
email:{type:String,required:true},
created:{type:Date},
status:{type:String,default:'Activate'},
isBlocked:{type:Boolean,default:false},
timeStamp:{type:Date},
password:{type:String},
profile:{type:Object},
User_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
 
})
  
const users = mongoose.model('users',userSchema);
module.exports = users