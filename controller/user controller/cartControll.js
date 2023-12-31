const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')

const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const wishlist = require('../../model/user/wishlistSchema')
const products = require('../../model/admin/productSchema')
const cartCollection = require('../../model/user/userCartSchema')
const cart = require('../../model/user/userCartSchema')
const ObjectId = require('mongodb').ObjectId;


//user cart get
const user_cart = async(req,res)=>{
    try {
        req.session.totalWithCoupon=0
        const username = req.session.user
        
        const user = await userCollection.findOne({username})

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          
        const cartData = await cartCollection.findOne({userId:user._id}).populate('Products.ProductId')
        
     

    
        
        const stockVariation = req.session.stockVariation;
        req.session.stockVariation='';
     

        if (!cartData) {
            return res.status(200).render('user/cart', {
              title: 'User Cart',
              username,
              cartItems: [], // An empty array to indicate there are no items in the cart
              cartToatal:0,
              stockVariation,
            });
          }
          req.session.cartData = cartData.Products
          let total=0
          cartData.Products.forEach((item)=>{
          total+= (item.ProductId.price*item.Quantity)
          })

          req.session.cartToatal=total
          req.session.cartId =  cartData._id
          req.session.cartProducts =  cartData
         
             const cart_=  await cartCollection.findOneAndUpdate(
            {userId:user._id},{$set:{TotalAmount:total}})
   
           cartData.save()
           
           res.status(200).render('user/cart', {
            title: 'User Wishlist',
            username,
            cartItems: cartData.Products, // Now, each cart item has the product data
            cartToatal:total,
            stockVariation,
          });
          
       
    } catch (error) {
        res.render('error',{error})
    }
}
//--------------------------------------------------------------------------------

const  increaseCartQuantity = async (req,res)=>{
    try {
        const productId = req.query.productId
        const productDetails =  await allProducts.findById(productId)
       
        res.json({success:true,stock:productDetails.stock})
    } catch (error) {
        console.log('error');
        res.json({success:false})

    }
}

const   add_to_Cart =async (req,res)=>{
    try { 
        const count = req.params.count
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
          }
        const username = req.session.user
        const user = await userCollection.findOne({username})
        if (!user) {
            return res.render('error')
          }
        const userCartData = await cartCollection.findOne(
            {$and:[{userId:user._id},{Products:{$elemMatch:{ProductId:productId}}}]}) 


            if(userCartData){

                 
                let quantity = req.query.quantity;
                
                quantity =Number(quantity)+Number(count)

                
                const productDetails =  await allProducts.findById(productId)
            
                if(Number(count)===1 &&  productDetails.stock  >= quantity){
       
               
                await cartCollection.updateOne(
                    {userId:user._id,'Products.ProductId':productId},{$set:{'Products.$.Quantity':quantity}})
                
                }else if(Number(count)===-1 && quantity > 0){

                    await cartCollection.updateOne(
                        {userId:user._id,'Products.ProductId':productId},{$set:{'Products.$.Quantity':quantity}})
                   
                }
               
            }else{  
                await cartCollection.updateOne(
                    {userId:user._id},{$push:{Products:{ProductId:productId}}},{upsert:true})
               
            }

                const cartData = await cartCollection.findOne({userId:user._id}).populate('Products.ProductId')
          let total=0
          cartData.Products.forEach((item)=>{
          total+= (item.ProductId.price*item.Quantity)
          })

      
          await cartCollection.updateOne(
            {userId:user._id},{$set:{TotalAmount:total}})
        
            res.json({
                success:true,
                message:'it is success  '
            })


    } catch (error) {
        console.log('addto cart error:',error);
    }
}

const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId;
   
        const username = req.session.user
        const userdata = await userCollection.findOne({username})
        if(!userdata){
            res.render('error',{error})
        }

        const userCartData = await cartCollection.findOne({userId:userdata._id});

        
        if (userCartData) {


         
           
            const updatedCart = await cartCollection.updateOne(
                {userId:userdata._id},
                { $pull: { Products: { ProductId: productId } } }
            );
  
 

            if (updatedCart.modifiedCount > 0) {
                console.log('Item removed from cart successfully.');
                res.json({ success: true });
            } else {
                console.log('Item not found in the cart.');
                res.json({ success: false, message: 'Item not found in the cart' });
            }
        } else {
            console.log('User cart data not found.');
            res.json({ success: false, message: 'User cart data not found' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports ={
    user_cart,
    increaseCartQuantity,
    add_to_Cart,
    removeFromCart,
   
}