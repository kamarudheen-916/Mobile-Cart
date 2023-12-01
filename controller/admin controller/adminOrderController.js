const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const OrdersCollection = require('../../model/user/userOrder')
const bcrypt = require('bcrypt')
const products = require('../../model/admin/productSchema')


const get_orderView = async (req,res)=>{
    try {
        const orderData =  await OrdersCollection.find()
      console.log('orderData--------',orderData);
        res.render('admin/adminOrderView',{title:'Admin Order View',orderData})
    } catch (error) {
        console.log('admin get_orderView error',error);
    }
}

const updateOrderStatus =async (req,res)=>{
    try {
        const productId = req.params.productId
        const newStatus =  req.body.status
        const orderData =  await OrdersCollection.findOne({_id:productId})
        if(orderData){
            orderData.Status = newStatus
            orderData.Products.forEach((product)=>{
                if(product.Status!=='Cancelled'){
                    product.Status = newStatus
                }
            })
            orderData.save()
            res.json({success:true,orderData})
        }
      console.log('orderData--------',orderData);
       
        
    } catch (error) {
        console.log('admin updateOrderStatus error',error);
    }
}

const fetchconfirmOrderReturnData = async (req,res)=>{
    try {
        const orderId = req.query.orderId
        // console.log('orderId=============',orderId);
        const OrderReturnData  =  await OrdersCollection.findOne({_id:orderId}).populate('Products.ProductId')
        console.log('orderId=============',OrderReturnData);
        res.json({success:true,OrderReturnData})
    } catch (error) {
        res.json({success:false})
        console.log('fetchconfirmOrderReturnData error',error);
    }
}
const confirmOrderReturn = async(req,res)=>{
    try {

        const returnOrderId = req.body.RetunOderID
        
        const orderData = await OrdersCollection.findOne({_id:returnOrderId}).populate('Products.ProductId')
        const UserData =  await customer.findOne({_id:orderData.UserId})
        if(!UserData){
            console.log('there is no userdata ');
        }
        console.log('userData when confirm Order Return :',UserData);
        orderData.Products.forEach((product)=>{ 
            console.log('===============------------------------');
            if(product.Status === 'Requested for return'){
             
            product.Status = 'Returned'
            console.log(product.Status);
            UserData.wallet.amount += product.ProductId.price
            console.log('===============------------------------*****************');
            UserData.wallet.transactions.push(
                { 
                transactionAmount :product.ProductId.price ,
                transactionType : 'credit',
                timeStamp : new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                description : 'From  Return Product'
                }
                )
            }
        }) 
        // orderData.save()
        UserData.save()

        if(!orderData){
            res.status(400).json({status:false}) 
        }

        const isAllReturned =  orderData.Products.map((item)=>item.Status ==='Returned').every(Boolean)
        if(isAllReturned){
        orderData.return.returnStatus='Returned'
        
        }
        orderData.save()
       
        
        orderData.Products.forEach(async(product)=>{
            if(product.Status === 'Returned'){
                console.log('===============------------------------');
            const AllProducts = await allProducts.findOne({_id:product.ProductId})
            const oldStock = AllProducts.stock
            AllProducts.stock = oldStock + product.Quantity
            AllProducts.save()
            }
        })
        res.json({success:true}) 
    } catch (error) {
        console.log('confirmOrderReturn error',error);
    }
}

const get_OrderDetails = async (req,res)=>{
    try {
        const orderId = req.params.id

        const orderData = await OrdersCollection.findOne({_id:orderId}).populate('Products.ProductId')
         
        // console.log('orderData with id ------------',orderData.Products[0].ProductId);
        const username = req.session.user

        res.render('admin/adminOrderDetails',{title:"Admin Order Details",username,orderData})
    } catch (error) {
        console.log('get_OrderDetails error ',error);
    }
}
module.exports = {
    get_orderView,
    updateOrderStatus,
    confirmOrderReturn,
    fetchconfirmOrderReturnData,
    get_OrderDetails,
}