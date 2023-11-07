const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');

const get_palceOrder = async (req,res)=>{
try {
    const username = req.session.user
    
        const userData = await userCollection.findOne({username})
        console.log('userData_______',userData);
        const allAddress = userData.Address
    res.render('user/placeOrder',{username,title:'Place Order',allAddress,userData})
} catch (error) {
    res.status(400).render('error',{error})
}
}

const get_confirmOrder =  async (req,res)=>{
    try {
        const username = req.session.user
        res.render('user/orderSuccess',{title:'Order Success',username})
    } catch (error) {
        
    }
}

module.exports={
get_palceOrder,
get_confirmOrder,
}