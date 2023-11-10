const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const OrdersCollection = require('../../model/user/userOrder')
const bcrypt = require('bcrypt')


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
            orderData.save()
        }
      console.log('orderData--------',orderData);
       

    } catch (error) {
        console.log('admin updateOrderStatus error',error);
    }
}
module.exports = {
    get_orderView,
    updateOrderStatus,
}