const mongoose = require('mongoose')
require('../../config/DBconnection')

const TransactionSchema =  new mongoose.Schema({
    
        transactionAmount :{type:Number},
        transactionType :{type:String,enum:['debit','credit']},
        timeStamp:{type:String,default:Date.now},
        description:{type:String}
    

})

const userSchema = new mongoose.Schema({
username:{type:String,required:true},
email:{type:String,required:true},
phone: { type: String },
created:{type:Date},
status:{type:String,default:'Activate'},
isBlocked:{type:Boolean,default:false},
timeStamp:{type:Date},
password:{type:String},
profile:{type:String},
Orders:[{}],
Address: [{
    HouseName: {type: String},
    city: { type: String },
    pincode: { type: Number },
    state: { type: String },
    mobileNumber: { type: Number },
 }],
wallet:{
    amount:{type:Number,default:0},
    transactions :[TransactionSchema]
},
User_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, 
  

})
  
const users = mongoose.model('users',userSchema);
module.exports = users