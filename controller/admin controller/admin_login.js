const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')


//logi get
const admin_login = async (req,res)=>{
  try {
    let admin = req.session.adminLoggedin
    if(admin){
        res.redirect('/admin/dashbord')
    }else{
   res.render('admin/adminLogin',{title:'Admin Login'})
    }
  } catch (error) {
    console.log('login get method error:---',error);
  }
}


//login post
const admin_login_post = async(req,res)=>{
    try {
        const username = req.body.username
        const admindata = await admin.findOne({username});
         
        console.log("admin:------",admindata);
         if(admindata){
            bcrypt.compare(req.body.password,admindata.password).then((status)=>{
             if (status) {
                 console.log('admin login success');
             req.session.adminName=req.body.username 
             req.session.adminLoggedin=true
             // res.render('admin/adminProducts',{title:'Admin Products',products})
             res.redirect('/admin/dashbord')
             } else {
                 console.log('login failed');
             }
         }).catch((error)=>{
             console.log('admin login error : '+error);
         })
         }else{
             console.log('login failed due to no user');
         }
    } catch (error) {
        console.log('login post method error:---',error);
    }
  
}
//admin logout
const admin_logout =(req,res)=>{
    try {
        req.session.adminLoggedin=false;
        res.redirect('/admin')
    } catch (error) {
        console.log('-----------admin logout error',error);
    }
  
}

module.exports = {
    admin_login,
    admin_login_post,
    admin_logout,
}