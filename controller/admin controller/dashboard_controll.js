const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')

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

module.exports = {
    get_dashbord,
}