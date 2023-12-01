const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const OrdersCollection =  require('../../model/user/userOrder')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const easyinvoice = require('easyinvoice');
const cartCollection = require('../../model/user/userCartSchema')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
const Razorpay = require('razorpay');
const razorpay =  require('../../utility/razorpay')
const crypto = require("crypto");
const Coupon = require('../../model/admin/admin_coupen');


const get_wallet = async(req,res)=>{
    try {
        const  username = req.session.user;
        const userData = await userCollection.findOne({username})
        const userWallet = userData.wallet
        console.log('======userWallet',userWallet);
        res.render('user/wallet',{username,title:'User Wallet',userWallet})
    } catch (error) {
        console.log('userWallerControll:-',error);
    }
}

module.exports={
    get_wallet,
}