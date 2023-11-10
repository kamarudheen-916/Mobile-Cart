const mongoose = require('mongoose')
require('../../config/DBconnection')
const {Schema ,objectId }= mongoose
const cartSchema = new mongoose.Schema({
    userId :{type:Schema.Types.ObjectId},
    Products:[{
        ProductId:{ type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        Quantity:{type:Number,default:1},
    }],
    TotalAmount :{type:Number},
    
})
  
const cart = mongoose.model('cart',cartSchema);
module.exports = cart