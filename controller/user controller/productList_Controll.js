const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')

//user product detailes
const get_product_List = async(req,res)=>{
        try {
        const product_category= req.params.category
        console.log('----------productId:',product_category);
        const username= req.session.user
        const products =await allProducts.find({category:product_category})
        console.log(products);
        res.render('user/userProductList',{title:'Product List Page',username,products})
   
        } catch (error) {
            console.log('----------wishlist controll error:----',error);
        }
}

module.exports={
    get_product_List, 
}