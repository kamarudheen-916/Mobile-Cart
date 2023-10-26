const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')

//admin get payment
const get_payment = async (req,res)=>{
    try {
        res.render('admin/adminPayments',{title:'Admin Payments'})
    } catch (error) {
        console.log('admin payment get page error : ',error);
    }
}


module.exports = {
    get_payment,
}