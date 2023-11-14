const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const OrdersCollection =  require('../../model/user/userOrder')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const easyinvoice = require('easyinvoice');
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
            returnExpiryDate:new Date(Date.now() +  7*24*60*60 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
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

const getInvoice = async (req,res)=>{
    try {
        const username = req.session.user
        const orderId = req.params.OrderId;
        console.log('--------------------------orderId',orderId);
        
        const orderData = await OrdersCollection.findOne({ _id: orderId }).populate('Products.ProductId');
        console.log('--------------------------get invoice',orderData);

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
                tax: 1,
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

const post_returnOrder = async(req,res)=>{
    try {
        const orderId =  req.params.OrderId
        const Reason = req.body.Reason
        const Message =  req.body.Message
        console.log('reason-----------',Reason);
        console.log('message----------',Message);
        console.log(orderId);
        const orderData  = await OrdersCollection.findOne({_id:orderId})
        console.log('orderData=============',orderData);
        if(orderData){

            if (!orderData.return) {
                orderData.return = {
                    returnStatus: 'not returned',
                    Reason: '',
                    Message: '',
                    returnDate: '',
                };
            }
            orderData.return.returnStatus =  'Request for Return';
            orderData.return.Reason =Reason;
            orderData.return.Message = Message;
            orderData.return.returnDate=new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            console.log('reason-----------',orderData.return.Reason);
            console.log('message----------',orderData.return.Message);
            orderData.save()
            console.log(orderData,'orderData=============');
            res.json({success:true})
        }else{
            console.log('there is no user data');
            res.json({success:false})
        }
    } catch (error) {
        
    }
}
module.exports={
get_palceOrder,
post_confirmOrder,
get_Orders,
post_remove_Orders,
get_OrderDetails,
getInvoice,
post_returnOrder,
}