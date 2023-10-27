const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const WishlistCollection=require('../../model/user/wishlistSchema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const ObjectId = require('mongodb').ObjectId;

const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const { consumers } = require('nodemailer/lib/xoauth2')

//gust user
const gustuser = async(req,res)=>{
    const products= await allProducts.find({ isDeleted:false})
    res.render('user/gustuser',{title:'Gust User',products})
}
// home rout
const userHome= async(req,res)=>{ 
    const username= req.session.user
    console.log('-----login user name:',username);
        if(req.session.logedIn){ 
            const products= await allProducts.find({ isDeleted:false})
            const user = await customer.findOne({username})
            const user_id = user._id
            const wishlist_ = await WishlistCollection.findOne({User_Id:user._id})
            const wishlist = wishlist_.Products
            console.log('---------///////',wishlist);
            
        res.render('user/index',{title:'Mobile Cart',products,username,wishlist})
        }else{
            res.redirect('/gustuser')
        }
        
}


module.exports={
    userHome,
    gustuser,
}