
const mongoose =require('mongoose')
require('../../config/DBconnection')


const productSchema = new mongoose.Schema({
    name:{type:String},
    category:{type:String},
    Highlight1:{type:String},
    Highlight2:{type:String},
    Highlight3:{type:String},
    Highlight4:{type:String},
    Highlight5:{type:String},
    Highlight6:{type:String},
    description:{type:String},
    price:{type:Number},
    stock:{type:Number},
    timeStamp:{type:Date},
    status:{type:String,default:'Active'},
    isDeleted:{type:Boolean,default:false},
    image:{type:Array},
    // image:[imageSchema],

    // Product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    
    
    })
 


   productSchema.index({ category: 'text', name: 'text' }, { weights: { name: 2, category: 1 } });

    const   products= mongoose.model('products',productSchema)
    module.exports =products;