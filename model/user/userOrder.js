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

const OrdersSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId },
  Status: { type: String, default:"Order Placed"},
  email:{type:String,required:true},
  Products: [{
    ProductId: { type: Schema.Types.ObjectId , ref: "products" },
    Quantity: { type: Number },
  }],
  PaymentMethod: {type: String},
  OrderDate: { type: String },
  ExpectedDeliveryDate:{type: String},
  TotalPrice: { type: Number },
  PaymentStatus: {type: String, default: "Pending"},
  CouponId: { type: Schema.Types.ObjectId },
  Address: { type: ShippedAddressSchema },
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders