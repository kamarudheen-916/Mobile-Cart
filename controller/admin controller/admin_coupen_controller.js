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
    
    
    
   
    
    
    const editcouponget=async(req,res)=>{
      try {
        const couponId = req.params.couponId;
        const coupons = await Coupon.findById(couponId);
        res.json({success:true,coupons})
        // res.render('admin/adminEditCoupon', { title:'Edit Coupon',coupon });
      } catch (error) {
        console.error("error while rendering the edit coupon page",error);
      }
    }
    
    
    
    const editCoupon=async(req,res)=>{
      try {
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
        editcouponget,
        editCoupon
    }

