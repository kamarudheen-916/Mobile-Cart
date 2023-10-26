
const mongoose =require('mongoose')
require('../../config/DBconnection')

const categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String}, 
    timeStamp:{type:Date} ,
    status:{type:String,default:'Active'},
    isBlocked:{type:Boolean,default:false},
    })
    const categories= mongoose.model('categories',categorySchema)
    module.exports =categories;