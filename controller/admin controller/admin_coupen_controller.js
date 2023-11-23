const User = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const Coupon = require('../../model/admin/admin_coupen')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')

const CouponManagement=async(req,res)=>{
    try {
        const coupons=await Coupon.find()
        const date = new Date()
        res.render('admin/adminCoupens', {title:'Admin Coupens', coupons,date })
    } catch (error) {
        console.log("error while rendering the show coupon page:",error);
        res.render('admin/adminCoupens', {title:'Admin Coupens', coupons: [] });
    }
    }

    const addCoupon=async(req,res)=>{
   
        try {
          
            const coupondata  =  req.body
          
            if(coupondata){
              const InsertCoupon = await Coupon.insertMany({
                couponName:req.body.couponName,
                couponCode:req.body.couponCode,
                discountAmount:req.body.discountAmount,
                MinimumPurchaseAmount:req.body.MinimumPurchaseAmount,
                couponType:req.body.couponType,
                startDate:req.body.startDate,
                endDate:req.body.endDate,

              })
              res.json({success:true})
            }else{
              res.json({success:false})
            }
           
        } catch (error) {
            console.log("error while add coupon",error);
        }
    }
    
    
    //delete coupon
    const deleteCoupon=async(req,res)=>{
      const couponId = req.params.couponId;
      try {
        
        await Coupon.findByIdAndRemove(couponId);
    
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting coupon:", error);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
    
    
    
    //apply coupon and check coupon
    // const applyCoupon = async (req, res) => {
    //   try {
    //     const email = req.session.user;
    //     const code = req.body.couponCode;
    //     const total = req.body.total;
    //     let discount = 0;
    
    //     // Find the user by email
    //     const user = await User.findOne({ email });
    //     const userId = user._id;
    
    //     // Find the coupon by code
    //     const couponMatch = await Coupon.findOne({ couponCode: code });
    
    //     if (couponMatch) {
    //       // Check if the coupon is active
    //       if (couponMatch.status === true) {
    //         const currentDate = new Date();
    //         const startDate = couponMatch.startDate;
    //         const endDate = couponMatch.endDate;
    
    //         // Check if the current date is within the coupon validity period
    //         if (startDate <= currentDate && currentDate <= endDate) {
    //           // Check coupon type
    //           if (couponMatch.couponType === "public" || (couponMatch.couponType === "private" && couponMatch.userIds.includes(userId))) {
    //             // Check if the coupon usage limit is reached
    //             if (couponMatch.limit === 0 || couponMatch.limit > 0) {
    //               // Check if the user has already used the coupon
    //               const couponUsed = await Coupon.findOne({
    //                 couponCode: couponMatch.couponCode,
    //                 "usedBy.userId": userId,
    //               });
    
    //               if (couponUsed) {
    //                 return res.json({ error: "You have used the coupon once" });
    //               } else {
    //                 // Apply the discount based on coupon type
    //                 if (couponMatch.discountType === "fixed") {
    //                   if (total >= couponMatch.minAmountFixed) {
    //                     discount = couponMatch.amount;
    //                   } else {
    //                     return res.json({
    //                       error: `Cart should contain a minimum amount of ${couponMatch.minAmountFixed}`,
    //                     });
    //                   }
    //                 } else {
    //                   if (total >= couponMatch.minAmount) {
    //                     discount = total * (couponMatch.minAmount / 100);
    //                   } else {
    //                     return res.json({
    //                       error: `Cart should contain a minimum amount of ${couponMatch.minAmount}`,
    //                     });
    //                   }
    //                 }
    
    //                 // Update user's grand total and save the coupon usage
    //                 req.session.grandTotal = total - discount;
    
    //                 // Save coupon usage
    //                 couponMatch.usedBy.push({
    //                   userId: userId,
    //                   usedAt: new Date(),
    //                 });
    
    //                 await couponMatch.save();
    
    //                 // Respond with success and updated information
    //                 return res.status(200).json({ success: true, discount, grandTotal: req.session.grandTotal });
    //               }
    //             } else {
    //               return res.json({ error: "Coupon limit reached" });
    //             }
    //           } else {
    //             return res.json({ error: "Coupon is not applicable to the user" });
    //           }
    //         } else {
    //           return res.json({ error: "Coupon is expired" });
    //         }
    //       } else {
    //         return res.json({ error: "Coupon is not active" });
    //       }
    //     } else {
    //       return res.json({ error: "No such coupon found" });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.json({ error: "Some error occurred" });
    //   }
    // };
    
    
    const editcouponget=async(req,res)=>{
      try {
        const couponId = req.params.couponId;
        const coupons = await Coupon.findById(couponId);
        console.log('-------------------------------',coupons);
        res.json({success:true,coupons})
        // res.render('admin/adminEditCoupon', { title:'Edit Coupon',coupon });
      } catch (error) {
        console.error("error while rendering the edit coupon page",error);
      }
    }
    
    
    
    const editCoupon=async(req,res)=>{
      try {
        console.log(req.body);
        const { couponName, couponCode, discountAmount, MinimumPurchaseAmount, couponType, startDate, endDate } = req.body;
        const coupon=await Coupon.findByIdAndUpdate(req.params.couponId,
          {
            $set:
            {
              couponName : couponName,
              couponCode : couponCode,
              discountAmount : discountAmount,
              MinimumPurchaseAmount : MinimumPurchaseAmount,
              couponType : couponType,
              startDate : startDate,
              endDate : endDate,
            }
          })
        console.log('couponName:------------------',req.params.couponId);
        
        
        
        console.log(' res.json({success:true})');
        res.json({success:true})
    
      } catch (error) {
        console.error("error while editing the coupon:",error)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }
    
    
    module.exports={
        CouponManagement,
        addCoupon,
        deleteCoupon,
        // applyCoupon,
        editcouponget,
        editCoupon
    }

