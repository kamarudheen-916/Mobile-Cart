const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const cartCollection =require('../../model/user/userCartSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;

//user product detailes
const get_productDetails = async(req,res)=>{
    try {
        const productId= req.params.id
        
        console.log('----------productId:',productId);
        const username= req.session.user
        if(req.session.logedIn){
            const products =await allProducts.findOne({_id:new ObjectId(productId)})
            console.log(products);

              // Fetch the user's cart data
        const user = await userCollection.findOne({ username });
        console.log('------------------------userCartData', user);

        // Fetch the user's cart data
        const userCartData = await cartCollection.findOne({ userId: user._id });
        console.log('------------------------userCartData', userCartData);

        // Declare cartProductIds outside the if block
        let cartProductIds = new Set();

        // Check if userCartData is not null and has 'Products'
        if (userCartData && userCartData.Products) {
            // Create a Set of productIds that are in the cart
            cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));
            console.log('------------------------cartProductIds', cartProductIds);
        }
            res.render('user/productDetails',{title:'Product Details',username,products,cartProductIds})

            

        }else{
            res.redirect('/gustuser')
        }
    } catch (error) {
        console.log('usre product datails error:--------------',error);
        res.render('error',{error})
    }

   
}

module.exports={
    get_productDetails, 
}