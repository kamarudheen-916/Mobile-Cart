const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const cartCollection =require('../../model/user/userCartSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const wishlist = require('../../model/user/wishlistSchema')
const products = require('../../model/admin/productSchema')
const ObjectId = require('mongodb').ObjectId;

//user product detailes
const get_wishlist = async(req,res)=>{
    try {
        const username = req.session.user;
        const user = await userCollection.findOne({ username });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const userWishlist = await wishlist.findOne({ User_Id: user._id }).populate('Products.Product_id')
        // console.log('**********************',userWishlist.Products);
        if (!userWishlist) {
          return res.status(200).render('user/wishlist', {
            title: 'User Wishlist',
            username,
            wishlistItems: [], // An empty array to indicate there are no items in the wishlist
          });
        }

        
        const user_id = user._id;

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

        return res.status(200).render('user/wishlist', {
          title: 'User Wishlist',
          username,
          wishlistItems: userWishlist.Products, // Now, each wishlist item has the product data
          cartProductIds,
        });
      } catch (error) {
        console.log('Wishlist retrieval error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}



/////////////////////////////////////////////////////////////////////////////////////////////
//add and remove from wish list
const add_wishlist = async(req,res)=>{
    try {
        const { productId } = req.body; // Assuming you pass the product ID in the request body
      
        if (!productId) {
          return res.status(400).json({ error: 'Product ID is required' });
        }
        // console.log('--------/////',productId);
        const username = req.session.user;
        const user = await userCollection.findOne({ username: username });
      
        if (!user) {
          return res.render('error')
        }
      
        const userWishlist = await wishlist.findOne(
          {$and:[{User_Id: user._id },{Products:{$elemMatch:{ Product_id:productId}}}]})
        // console.log('--------------------',userWishlist);
        if (userWishlist) {
           // If the user's wishlist exists, add the product to it using updateOne
          req.session.wishlistAdded = productId
          
           await wishlist.updateOne(
            { User_Id: user._id },
            { $pull: { Products: { Product_id: productId } } }
          );
        } else {
         // If the user's wishlist doesn't exist, create a new one
        
         req.session.wishlistAdded = true
         await wishlist.updateOne({User_Id:user._id},{$push:{Products:{Product_id:productId}}},{upsert:true})
        
        }
      
        return res.status(200).json({ message: 'Product added to wishlist successfully' });
      } catch (error) {
        console.log('Add to wishlist error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const delete_wishlist = async(req,res)=>{
    try {
        // console.log('---------------skldblsakvjd');
        const username =req.session.user
        // console.log(username+"username");
        const user = await userCollection.findOne({username:username})
        // console.log(user+"user!!!!!!!!!!!");
        if(!user){
            return res.render('error')
        }
        const productId =  req.params.productId
        // console.log(productId);
        const User_Id =  user._id;
        // console.log(User_Id+"!!!!!@@@@@@@@@2");
        // console.log('productId---------',productId);

    
        await wishlist.updateOne(
            { User_Id: User_Id },
            { $pull: { Products: { Product_id:productId} } }
        );
        res.json({ok:true})          
    } catch (error) {
        console.log('remove to wishlist error:', error);
        return res.render('error')
    }
}
module.exports={
    get_wishlist, 
    add_wishlist,
    delete_wishlist,
    
}