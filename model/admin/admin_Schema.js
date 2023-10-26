const mongoose =require('mongoose')
require('../../config/DBconnection')

const admin_Schema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
   
    
    })
    const admin= mongoose.model('admin',admin_Schema)
    module.exports =admin;