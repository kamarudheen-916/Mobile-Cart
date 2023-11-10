const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const OrdersCollection =  require('../../model/user/userOrder')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const cartCollection = require('../../model/user/userCartSchema')
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

const post_confirmOrder =  async (req,res)=>{
    try {
        const username = req.session.user
        const cartToatal =  req.session.cartToatal
        // const cartProducts = req.session.cartProducts
        
        const confirmOrderData =  req.body
        const userData =await userCollection.findOne({username})

        let shippingAddress = {}
        userData.Address.forEach((address)=>{
            if(address._id.toString()===new ObjectId(confirmOrderData.SelectAddress).toString()){
                shippingAddress=address
            }
        })
        const cartProducts =  await cartCollection.findOne({userId:userData._id}).populate("Products.ProductId")

        const insertOrderData = await OrdersCollection.insertMany({
            UserId: new ObjectId(userData._id),
            email:userData.email,
            Products:cartProducts.Products,
            PaymentMethod: confirmOrderData.paymentMethods,
            OrderDate: new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            ExpectedDeliveryDate:new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            TotalPrice: cartToatal,
            Address: shippingAddress,
        })
       
            const orderData = cartProducts
            console.log('orderData------------------',orderData);   
        if (orderData && orderData.Products) {
            for(const items of orderData.Products){
                const ProductId =items.ProductId;
                const Quatity = items.Quantity
                const item = await allProducts.findById(ProductId);
                
                if(item){
                    const updateQuatity = item.stock -Quatity;
                    if(updateQuatity===0){
                        item.status='Out Of Stock';
                    }
                    item.stock = updateQuatity
                    await item.save()
                }
            }
          } else {
            console.log('No order data found for the user.');
            // Handle the case where there is no order data for the user
          }
       
            //clear cart products when confirm order
        const clearCart = await cartCollection.findOneAndDelete({userId:userData._id})
        
        res.render('user/orderSuccess', { title: 'Order Success', username });

        console.log('check---------------************///////////');
    
    } catch (error) {
        res.status(400).render('error',{error})
        console.log('confirmOrder error ----------',error);
        
    }
}

const get_Orders = async (req,res)=>{
    try {
        const username = req.session.user
        const userData = await userCollection.findOne({username})
        console.log('userOrderData---------------',userData);   
        const userOrderData = await OrdersCollection.find({UserId:userData._id}).populate('Products.ProductId')
        console.log('userOrderData---------------',userOrderData);
        res.render('user/Orders',{title:'User Orders',username,userOrderData})
    } catch (error) {
        console.log('get Orders Page error ',error);
    }
}

const post_remove_Orders = async (req,res)=>{
    try {

        const username = req.session.user
        const productId = req.params.ProductId
        const orderData = await OrdersCollection.findOne({_id:productId})       
        console.log('productId-----------',productId);
        console.log('productId-----------',orderData);

        if(orderData){
            orderData.Status = 'Cancelled'
            await orderData.save()
        }
        res.json({success:true})

    } catch (error) {
        console.log('remove order error',error);
        res.json({ success: false, message: 'User Order data not found' });
    }
}

const get_OrderDetails = async (req,res)=>{
    try {
        const orderId = req.params.id

        const orderData = await OrdersCollection.findOne({_id:orderId}).populate('Products.ProductId')
         
        console.log('orderData with id ------------',orderData.Products[0].ProductId);
        const username = req.session.user

        res.render('user/OrderDetails',{title:"User Order Details",username,orderData})
    } catch (error) {
        console.log('get_OrderDetails error ',error);
    }
}

module.exports={
get_palceOrder,
post_confirmOrder,
get_Orders,
post_remove_Orders,
get_OrderDetails,
}