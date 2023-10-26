const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')

//user product detailes
const get_productDetails = async(req,res)=>{
    const productId= req.params.id
    console.log('----------productId:',productId);
    const username= req.session.user
    if(req.session.logedIn){
        const products =await allProducts.findOne({_id:productId})
        console.log(products);
        res.render('user/productDetails',{title:'Product Details',username,products})
    }else{
        res.redirect('/gustuser')
    }
   
}

module.exports={
    get_productDetails, 
}