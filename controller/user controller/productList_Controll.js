const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;

//user product detailes
const get_product_List = async(req,res)=>{
        try {
            
        req.session.product_category = req.params.category
        const product_category= req.session.product_category
        const category =product_category
        console.log('----------productId:',product_category);
        const username= req.session.user
        let products_count=  await allProducts.find({category:product_category}).count()
        let pageNumber = req.query.page?Number(req.query.page):0; 
        products_count = products_count/5
        let skip =pageNumber*5
        console.log('---skip',skip);
        let products =await allProducts.find({category:product_category}).skip(skip).limit(5)
        
        res.render('user/userProductList',{title:'Product List Page',username,products,products_count,category})
   
        } catch (error) {
            console.log('----------product list  error:----',error);
        }
}


module.exports={
    get_product_List, 
}