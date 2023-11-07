// const userCollection = require('../../model/user/userSchema')
// const allProducts=require('../../model/admin/productSchema')
// const sendMail =require('../../controller/email&otp-Controller/emailController')
// const bcrypt = require('bcrypt')
// // //gust user
// // const gustuser = async(req,res)=>{
    
// //     const products= await allProducts.find({ isDeleted:false})
    
// //     res.render('user/gustuser',{title:'Gust User',products})
// // }
// // // home rout
// // const userHome= async(req,res)=>{ 
// //     const username= req.session.user
// //     console.log('-----login user name:',username);

// //         if(req.session.logedIn){ 
// //             const products= await allProducts.find({ isDeleted:false})
// //         res.render('user/index',{title:'Mobile Cart',products,username})
// //         }else{
// //             res.redirect('/gustuser')
// //         }
        
// // }

// //user product detailes
// const get_productDetails = async(req,res)=>{
//     const productId= req.params.id
//     console.log('----------productId:',productId);
//     const username= req.session.user
//     if(req.session.logedIn){
//         const products =await allProducts.findOne({_id:productId})
//         console.log(products);
//         res.render('user/productDetails',{title:'Product Details',username,products})
//     }else{
//         res.redirect('/gustuser')
//     }
   
// }

// module.exports={
//     // userHome,
//     // gustuser,
//     get_productDetails, 
// }