const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;
require('../../config/DBconnection')

const couponSchema = new mongoose.Schema({
    couponName: String,
    couponCode: {
        type: String,
        required: true,
        unique: true 
    },
    usedBy: [
        {
          userId: Schema.Types.ObjectId,
          couponCode: Schema.Types.ObjectId,
          status: {type: String, default: 'Attempted'}
        }
      ],
  discountAmount: Number,
  MinimumPurchaseAmount: Number,
  couponType: String,
  isUsed:{type:Boolean,default:false},
  startDate: String,
  endDate: String,
  category: Array,
  status: { type: Boolean, default: true },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
