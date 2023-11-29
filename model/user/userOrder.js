const mongoose = require('mongoose');
require('../../config/DBconnection')
const { Schema, ObjectId } = mongoose;


const ShippedAddressSchema = new Schema({
  HouseName: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: Number, required: true },
  state: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
});

const ReturnSchema = new Schema({
  returnStatus:{ type: String, default:"not returned"},
  Reason:{type:String},
  Message:{type:String},
  returnDate:{type:String},
  
})
const CancelSchema =  new Schema({
  CancelStatus:{ type: String, default:"not returned"},
  Reason:{type:String},
  Message:{type:String},
  returnDate:{type:String},
})


const OrdersSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId },
  Status: { type: String, default:"Order Placed"},
  return:{type:ReturnSchema},
  cancel:{type:CancelSchema},
  email:{type:String,required:true},
  Products: [{
    ProductId: { type: Schema.Types.ObjectId , ref: "products" },
    Quantity: { type: Number },
    Status:{type:String},
  }],
  PaymentMethod: {type: String},
  OrderDate: { type: String },
  ExpectedDeliveryDate:{type: String},
  returnExpiryDate:{type:String},
  couponAmount:{type:Number,default:0},
  walletAmount:{type:Number,default:0},
  TotalPrice: { type: Number },
  PaymentStatus: {type: String},
  CouponId: { type: Schema.Types.ObjectId },
  Address: { type: ShippedAddressSchema },
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders