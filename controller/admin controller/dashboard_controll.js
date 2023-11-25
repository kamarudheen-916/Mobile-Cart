const customer = require('../../model/user/userSchema')
const Order  = require('../../model/user/userOrder')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')


const get_dashbord=async(req,res)=>{    
    try {
        const admin = req.session.adminLoggedin
    if(admin){
        res.render('admin/adminDashbord',{title:'Admin Dashbord'})
    }else{
        res.redirect('/admin') 
    }
   
    } catch (error) {
        console.log('dashboard get method error :---',error);
    }
}

const get_order_data = async (req, res) => {
        try {
            const orderData = await Order.find({'return.returnStatus':{$ne:'Returned'}})
            console.log('===============',orderData);
            res.json({success:true,orderData})
        } catch (error) {
            console.log('admin dashboard get order data error : ',error);
        }
  };
  

module.exports = {
    get_dashbord,
    get_order_data,
}