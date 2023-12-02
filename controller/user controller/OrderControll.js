const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const OrdersCollection =  require('../../model/user/userOrder')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const easyinvoice = require('easyinvoice');
const cartCollection = require('../../model/user/userCartSchema')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
const Razorpay = require('razorpay');
const razorpay =  require('../../utility/razorpay')
const crypto = require("crypto");
const Coupon = require('../../model/admin/admin_coupen');


const get_palceOrder = async (req,res)=>{
try {   

        
        const username = req.session.user
        const cartToatal =  req.session.totalWithCoupon? req.session.totalWithCoupon: req.session.cartToatal
        
        const userData = await userCollection.findOne({username})

        const cartProducts = await cartCollection.findOne({userId:userData._id})
        
        if(cartProducts === null){
            res.redirect('/');
        }
        console.log('cartProducts============',cartProducts);
        
        await Promise.all(cartProducts.Products.map(async (cartProduct) => {
            const product = await allProducts.findOne({ _id: cartProduct.ProductId });

            if (cartProduct.Quantity > product.stock) {
              
                req.session.stockVariation ='The available stock of '+ product.name+' is ' + product.stock +' only ';
                // console.log(' req.session.stockVariation:', req.session.stockVariation);
                res.redirect('/get_cart');
            }
        }));

        // console.log('userData_______',userData);
        const allAddress = userData.Address

         res.render('user/placeOrder',{username,title:'Place Order',allAddress,userData,cartToatal})
} catch (error) {
    console.log(error);
    res.status(400).render('error',{error})
    
}
}

const confirmOrder =async (req,res)=>{
    try {

            //check the stock of cart products
            const username = req.session.user
            const userData = await userCollection.findOne({username})

            const cartProducts = await cartCollection.findOne({userId:userData._id})
            
            await Promise.all(cartProducts.Products.map(async (cartProduct) => {
                const product = await allProducts.findOne({ _id: cartProduct.ProductId });
    
                if (cartProduct.Quantity > product.stock) {
                  
                    req.session.stockVariation ='The available stock of '+ product.name+' is ' + product.stock +' only ';
                    res.json({success:'Quantity Exeeded',QuantityError:req.session.stockVariation});
                    // res.redirect('/get_cart');
                }else{
                    req.session.confirmOrderBody =  req.body
                    const newToatal =  req.session.totalWithCoupon? req.session.totalWithCoupon: req.session.cartToatal
                    // console.log('req.session.confirmOrderBody.paymentMethods',req.session.confirmOrderBody.paymentMethods)
                 if(req.session.confirmOrderBody.paymentMethods ==='CashOnDelivery'){
                    console.log('----------**************/////////');
                    req.session.paymentStatus = 'CashOnDelivery'
                    res.json({success:'cahsOnDelevery'})
                }else if(req.session.confirmOrderBody.paymentMethods ==='WalletPayment'){
                    req.session.paymentStatus = 'WalletPayment'
                    if(newToatal > userData.wallet.amount){
                        res.json({success:'WalletAmountExeeded'})
                    }else{
                        res.json({success:'WalletPayment'}) 
                    }
                    
                }else if(req.session.confirmOrderBody.paymentMethods ==='OnliePayment'){
                        // console.log('req.session.confirmOrderBody.paymentMethods',req.session.confirmOrderBody.paymentMethods)
                        var order = {
                            amount: newToatal*100,  // amount in the smallest currency unit
                            currency: "INR",
                            receipt: req.session.cartId,
                          };
                          await razorpay 
                          .createRazorpayOrder(order)
                          .then((createdOrder)=>{
                            req.session.paymentStatus = 'OnliePayment'
                          res.json({success:'OnliePayment',createdOrder,order});
                          })
                          .catch((error) => {
                            console.error('Razorpay error:', error);
                            res.status(500).json({ error: 'Internal Server Error' });
                        })
                        
                          
                    }
                }
            }));


           
    } catch (error) {
        console.log('confirmOrder:',error)
        // res.json({success:false})
    }
}

const applyCoupon = async(req,res)=>{
    try {
        const couponCode =  req.query.couponCode
        req.session.couponCode =  couponCode
        const CouponData =  await Coupon.findOne({couponCode})
        console.log(CouponData);
        if(!CouponData){
            res.json({success:false,message:'Wrong Coupon Code!!!'})
        }else{
            if(CouponData.isUsed){
                res.json({success:false,message:'This Coupon Is Already Used!!!'})
            }else if(req.session.cartToatal<CouponData.MinimumPurchaseAmount){
               
                res.json({success:false,message:`Coupon only can be used above ₹ ${CouponData.MinimumPurchaseAmount} !!!`})
            }else {
                console.log('************//////////////////');
            const discountAmount  =  req.session.cartToatal - CouponData.discountAmount
            req.session.totalWithCoupon =  discountAmount
            req.session.couponAmount =  CouponData.discountAmount
            res.json({success:true,discountAmount})
            }
        }
       
    } catch (error) {
        console.log('apply coupon error',error);
    }
}

const verify_payment = async (req, res) => {
    try {
      let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    
      hmac.update(
        req.body.payment.razorpay_order_id +
          "|" +
          req.body.payment.razorpay_payment_id
      );
    
      hmac = hmac.digest("hex");
      
      if (hmac === req.body.payment.razorpay_signature) {

        const orderId = new mongoose.Types.ObjectId(
          req.body.order.createdOrder.receipt
        );
        
        res.json({ success: true });
      } else {
        // console.log("hmac failed");
        res.json({ failure: true });
      }
    } catch (error) {
      console.error("failed to verify the payment", error);
    }
  };

const confirmOrderAndGetOrderSucess =  async (req,res)=>{
    try {
        // console.log('check enter ------------------');
        const username = req.session.user
        const newToatal =  req.session.totalWithCoupon? req.session.totalWithCoupon: req.session.cartToatal
      
        
        // const cartProducts = req.session.cartProducts
        
        const confirmOrderData =  req.session.confirmOrderBody
        // console.log('confirmOrderData:-----------',confirmOrderData);
        const userData =await userCollection.findOne({username})

        let shippingAddress = {}
        userData.Address.forEach((address)=>{
            if(address._id.toString()===new ObjectId(confirmOrderData.SelectAddress).toString()){
                shippingAddress=address
            }
        })
        const cartProducts =  await cartCollection.findOne({userId:userData._id}).populate("Products.ProductId")
        if(!cartProducts){  
            res.redirect('/')
        }
        // console.log(req.session.paymentStatus );
        let paymentStatus;
        if(req.session.paymentStatus === 'CashOnDelivery'){
             paymentStatus = 'Pending'
        }else if(req.session.paymentStatus ==='OnliePayment'){
            paymentStatus= 'Pament successfull(Online Payment)'
        }else if(req.session.paymentStatus ==='WalletPayment'){
            userData.wallet.amount -= newToatal
            userData.wallet.transactions.push(
                {
                transactionAmount :newToatal,
                transactionType : 'debit',
                timeStamp : new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                description : 'Product Purchase.'
                }
                )
            userData.save();
            paymentStatus= 'Pament successfull(Wallet)'
        }

        const insertOrderData = await OrdersCollection.insertMany({
            UserId: new ObjectId(userData._id),
            email:userData.email,
            Products:cartProducts.Products,
            PaymentMethod: confirmOrderData.paymentMethods,
            OrderDate: new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            ExpectedDeliveryDate:new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            returnExpiryDate:new Date(Date.now() + 60*60 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            PaymentStatus: paymentStatus,
            couponAmount:req.session.couponAmount,
            walletAmount:0,
            TotalPrice: newToatal,
            Address: shippingAddress,
        })
       
            const orderData = cartProducts
            // console.log('orderData------------------',orderData);   
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
        const couponCode =  req.session.couponCode
        const CouponData =  await Coupon.findOneAndUpdate(
            {couponCode},
            {$set:{isUsed:true}})
        res.render('user/orderSuccess', { title: 'Order Success', username });

        // console.log('check---------------************///////////');
    
    } catch (error) {
        res.status(400).render('error',{error})
        console.log('confirmOrder error ----------',error);
        
    }
}



const get_Orders = async (req,res)=>{
    try {
        const username = req.session.user
        const userData = await userCollection.findOne({username})

        
        // console.log('userOrderData---------------',userData);   
        const userOrderData = await OrdersCollection.find({UserId:userData._id}).populate('Products.ProductId')
        // console.log('userOrderData---------------',userOrderData);
        if (userOrderData.length > 0) {
            // Assuming you want to iterate over each order
            userOrderData.forEach(order => {
                if (!order.return) {
                    order.return = {
                        returnStatus: 'not returned',
                        Reason: '',
                        Message: '',
                        returnDate: '',
                    };
                }
            });
            
            // Assuming you want to save each order separately
            // If you want to save all orders together, you may need to adjust this part accordingly
            await Promise.all(userOrderData.map(order => order.save()));
        }
        let nowDate =  new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
        res.render('user/Orders',{title:'User Orders',username,userOrderData,nowDate})
    } catch (error) {
        console.log('get Orders Page error ',error);
    }
}

const fetchCancelOrderProducts = async (req,res)=>{
    try {
        const orderId = req.query.orderid
            // const orderData = await OrdersCollection.findOne({_id:productId})
            const userOrderData = await OrdersCollection.findOne({_id:orderId}).populate('Products.ProductId')
            
        console.log('userOrderData---------------****lllll',userOrderData);
        res.json({success:true,userOrderData})
    } catch (error) {
        console.log('fetchCancelOrderProducts error:',error);
        res.json({success:false});
    }
}

const cancelOrder = async (req,res)=>{
    try {

        const username = req.session.user
        const OrderId = req.params.OrderId
        console.log('OrderId:',OrderId); 
        const orderData = await OrdersCollection.findOne({_id:OrderId}).populate('Products.ProductId')
        const userData = await userCollection.findOne({username})
        const cancelOrderData =  req.body
        console.log('cancelorderData:==============',cancelOrderData);
        const IndividualcancelOrderData = cancelOrderData.products
        console.log(IndividualcancelOrderData);
        //here cancelOrderData is an object from req.body from frond end
        if('AllProducts' in cancelOrderData){  
        if(orderData){
            orderData.Status = 'Cancelled'
            
            let AllCancelOrderData = []
            if(!Array.isArray(cancelOrderData.products)){
                AllCancelOrderData.push(cancelOrderData.products)
            }else{
                AllCancelOrderData = [...cancelOrderData.products]
            }
            
            orderData.Products.forEach((prod)=>{
                prod.Status = 'Cancelled'
                if(AllCancelOrderData.includes(prod.ProductId._id.toString())){
                    if(orderData.PaymentStatus !== 'Pending'){
                    userData.wallet.amount += prod.ProductId.price
                    userData.wallet.transactions.push(
                        {
                        transactionAmount :prod.ProductId.price ,
                        transactionType : 'credit',
                        timeStamp : new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                        description : 'Return from cancelation'
                        }
                        )

                    }
                }
            })
            
            await userData.save()
            await orderData.save()
        }
        res.json({success:'AllProducts'})
        }else{
           
            orderData.Products.forEach((product)=>{
                
                if(IndividualcancelOrderData.includes(product.ProductId._id.toString())){
                    product.Status = 'Cancelled'
                    orderData.TotalPrice -= product.ProductId.price 
                    if(orderData.PaymentStatus !== 'Pending'){
                        // console.log('******------------=========',orderData.PaymentStatus);
                        userData.wallet.amount += product.ProductId.price

                        userData.wallet.transactions.push(
                            {
                                transactionAmount :product.ProductId.price ,
                            transactionType : 'credit',
                            timeStamp : new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                            description : 'Return from cancelation'
                            }
                            )
                    }

                }
            })
            const isAllReturned =  orderData.Products.map((item)=>item.Status ==='Cancelled').every(Boolean)
            if(isAllReturned){
            orderData.Status='Cancelled'
            
            }
            await userData.save()
            await orderData.save()
        res.json({success:'Individualcancel'})
        }
    } catch (error) {
        console.log('remove order error',error);
        res.json({ success: false, message: 'User Order data not found' });
    }
}


const get_OrderDetails = async (req,res)=>{
    try {
        const orderId = req.params.id

        const orderData = await OrdersCollection.findOne({_id:orderId}).populate('Products.ProductId')
         
        // console.log('orderData with id ------------',orderData.Products[0].ProductId);
        const username = req.session.user

        res.render('user/OrderDetails',{title:"User Order Details",username,orderData})
    } catch (error) {
        console.log('get_OrderDetails error ',error);
    }
}

const getInvoice = async (req,res)=>{
    try {
        const username = req.session.user
        const orderId = req.params.OrderId;
        // console.log('--------------------------orderId',orderId);
        
        const orderData = await OrdersCollection.findOne({ _id: orderId }).populate('Products.ProductId');
        // console.log('--------------------------get invoice',orderData);

        if (!orderData) {
          return res.status(404).json({ success: false, message: 'Order not found' });
        }
    
        const invoiceData = {
            documentTitle: 'Invoice', // Title of the document
            currency: 'INR', // Currency code (e.g., USD, EUR, etc.)
            taxNotation: 'gst', // Tax notation (e.g., gst, vat, etc.)
            marginTop: 25, // Margins for the document
            marginRight: 25,
            marginLeft: 25,
            marginBottom: 25,
            logo: 'your-logo-url', // URL or base64-encoded logo image
            sender: {
              company: 'MOBILE CART PLTD',
              address: 'mgo HUB,KERALA',
              zip: '673001 ',
              city: 'KOZHIKODE',
              country: 'INDIA',
            },
            client: {
                company: username, // Replace with actual user details
                address: orderData.Address.HouseName,
                city: orderData.Address.city,
                zip: orderData.Address.pincode,
                country: orderData.Address.state,
                mobileNumber: orderData.Address.mobileNumber,
              
            },
            
              
            invoiceNumber: `INV-${orderId}`, // Unique invoice number
            invoiceDate: new Date(),
            products: orderData.Products.map((product) => ({
                quantity: product.Quantity,
                description: product.ProductId.name,
                price: parseFloat(product.ProductId.price) || 0, // Convert to number, ensure default value if conversion fails
                'tax-rate': 0,
            })),
            
            bottomNotice: 'Thank you for your purchase!', // Closing note on the invoice
          };
          
    
        const result = await easyinvoice.createInvoice(invoiceData);
    
        // Set headers to trigger download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    
        // Send the generated PDF as a response
        res.send(Buffer.from(result.pdf, 'base64'));
      } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
}

const fetchReturnOrderProducts = async(req,res)=>{
    try {
        const orderId =  req.query.OrderId;
        const userOrderData =  await OrdersCollection.findOne({_id:orderId}).populate('Products.ProductId')

        res.json({success:true,userOrderData})
    } catch (error) {
        res.json({success:false})
        console.log("fetchReturnOrderProducts : ",error);
    }
}

const post_returnOrder = async(req,res)=>{
    try {
        const orderId =  req.params.OrderId
        const returnOrderData = req.body
        console.log('returnOrderData===========',returnOrderData);
        const orderData  = await OrdersCollection.findOne({_id:orderId})
       
        if(orderData){
          
            
            if (!orderData.return) {
                orderData.return = {
                    returnStatus: 'not returned',
                    Reason: '',
                    Message: '',
                    returnDate: '',
                };
            }
                orderData.Products.forEach((product)=>{
                    console.log('orderData=============');
                if(returnOrderData.products.includes(product.ProductId._id.toString())){
                    product.Status = 'Requested for return'
                }
                })
            // orderData.return.returnStatus =  'Request for Return';
            // orderData.return.Reason =Reason;
            // orderData.return.Message = Message;
            // orderData.return.returnDate=new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            // console.log('reason-----------',orderData.return.Reason);
            // console.log('message----------',orderData.return.Message);
            orderData.save()
            // console.log(orderData,'orderData=============');
            res.json({success:true})
            
        }else{
            console.log('there is no user data');
            res.json({success:false})
        }
    } catch (error) {
        
    }
}
module.exports={
confirmOrder,
get_palceOrder,
confirmOrderAndGetOrderSucess,
applyCoupon,
get_Orders,
cancelOrder,
fetchCancelOrderProducts,
get_OrderDetails,
getInvoice,
fetchReturnOrderProducts,
post_returnOrder,
verify_payment,

}