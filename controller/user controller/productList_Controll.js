const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const WishlistCollection = require('../../model/user/wishlistSchema')
const cartCollection =require('../../model/user/userCartSchema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;

//user product detailes
const get_product_List = async(req,res)=>{
        try {
            
        req.session.product_category = req.params.category
        const product_category= req.session.product_category
        const category =product_category
        // console.log('----------productId:',product_category);
        const username= req.session.user
        let products_count=  await allProducts.find({category:product_category}).count()
        let pageNumber = req.query.page?Number(req.query.page):0; 
        products_count = products_count/5
        let skip =pageNumber*5
        // console.log('---skip',skip);
        let products =await allProducts.find({category:product_category}).skip(skip).limit(5)
        // Fetch the user's cart data
        const user = await userCollection.findOne({ username });
        // console.log('------------------------userCartData', user);

        // Fetch the user's cart data
        const userCartData = await cartCollection.findOne({ userId: user._id });
        // console.log('------------------------userCartData', userCartData);

        // Declare cartProductIds outside the if block
        let cartProductIds = new Set();

        // Check if userCartData is not null and has 'Products'
        if (userCartData && userCartData.Products) {
            // Create a Set of productIds that are in the cart
            cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));
            // console.log('------------------------cartProductIds', cartProductIds);
        }

        const wishlist_ = await WishlistCollection.findOne({ User_Id: user._id });
        const wishlist = wishlist_ ? wishlist_.Products : [];
        
        const allcategorys = await categoryCollection.find({},{name:1,_id:0})
        // console.log('categoryCollection--------------',allcategorys);

        res.render('user/userProductList',
        {title:'Product List Page',username,products,products_count,category,pageNumber,wishlist,cartProductIds,allcategorys})
       
        } catch (error) {
            console.log('----------product list  error:----',error);
        }
}

const filterByCategory = async(req,res)=>{
    try {
        const category =  req.query.category
        const Products = await allProducts.find({category})
        const username= req.session.user
        // Fetch the user's cart data
        const user = await userCollection.findOne({ username });
        
         // Fetch the user's cart data
         const userCartData = await cartCollection.findOne({ userId: user._id });
        
 
         // Declare cartProductIds outside the if block
         let cartProductIds = new Set();
 
         // Check if userCartData is not null and has 'Products'
         if (userCartData && userCartData.Products) {
             // Create a Set of productIds that are in the cart
             cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));
            //  console.log('------------------------cartProductIds', cartProductIds);
         }
         
        //  console.log('------------------------cartProductIds', cartProductIds);
         const wishlist_ = await WishlistCollection.findOne({ User_Id: user._id });
         const wishlist = wishlist_ ? wishlist_.Products : [];

         
        if(Products){
            res.json({success:true,Products,cartProductIds,wishlist})
        }
       
    } catch (error) {
        console.error('Error in filterByCategory:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    
}

const productListPagePriceFilter = async (req,res)=>{
    try {
        const minPriceInput = req.query.minPriceInput
        const maxPriceInput = req.query.maxPriceInput
        const category =   req.session.product_category
        const Products = await allProducts.find({
            $and: [  
                { price: { $gte: minPriceInput, $lte: maxPriceInput } }
            ]
        });
        
        const username= req.session.user
        // Fetch the user's cart data
        const user = await userCollection.findOne({ username });
        
         // Fetch the user's cart data
         const userCartData = await cartCollection.findOne({ userId: user._id });
        
 
         // Declare cartProductIds outside the if block
         let cartProductIds = new Set();
 
         // Check if userCartData is not null and has 'Products'
         if (userCartData && userCartData.Products) {
             // Create a Set of productIds that are in the cart
             cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));
            //  console.log('------------------------cartProductIds', cartProductIds);
         }
         
        //  console.log('------------------------cartProductIds', cartProductIds);
         const wishlist_ = await WishlistCollection.findOne({ User_Id: user._id });
         const wishlist = wishlist_ ? wishlist_.Products : [];

          
        if(Products){
            res.json({success:true,Products,cartProductIds,wishlist})
        }
       
        

    } catch (error) {
        res.json({success:false})
        console.log(error);
    }
}

module.exports={
    get_product_List, 
    filterByCategory,
    productListPagePriceFilter,
}