const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')



//admin get customers page
const get_customers = async (req,res)=>{
    
    try {
      let searched= false
      if(req.session.adminLoggedin){
          if(  req.session.customerSearched){ 
               searched = req.session.customerSearched
              const customers = req.session.searchCustomerData
              res.render('admin/adminCustomers',{title:'Admin  Customers Page',customers,searched})
          }else{
              
              const customers = await customer.find()
              res.render('admin/adminCustomers',{title:'Admin  Customers Page',customers,searched})
          }
       
      }else{
          res.redirect('/admin')
      }
      
    } catch (error) {
      console.log('get customers error:'+error)
    }    
  }
  
  //catogery search 
  const   post_search_customers = async (req,res)=>{
      try {
          let i=0;
          if(req.session.adminLoggedin){
              const searchData = req.body.search
              console.log('-------------------searchData',searchData);
              const searchCustomerData = await customer.find
              (
                  {username:{$regex:'^'+searchData,$options:'i'}}
              )
                  console.log(searchCustomerData);
              req.session.searchCustomerData= searchCustomerData
              req.session.customerSearched = true
              res.redirect('/admin/customers')
              console.log('-----------test');
          }else{
              console.log('admin not loggedIn');
              res.redirect('/admin')
          }
      } catch (error) {
          console.log('--------------------search customers error:',error)
      }
  }
  const get_customers_refresh = async (req,res)=>{
      try {
          req.session.customerSearched=false
          res.redirect('/admin/customers')
      } catch (error) {
          console.log('refresh is not working');
      }
  
  }
  
  //admin block customers
  const get_bolck_user = async (req,res)=>{
      try {
          if(req.session.adminLoggedin){
              const userBlockId = req.params.id
              const blockCustomers = await customer.findOne({_id:userBlockId})
              blockCustomers.isBlocked = !blockCustomers.isBlocked
              if(blockCustomers.isBlocked){
                  blockCustomers.status='Blocked'
                  console.log('customer blocked')
              }else{
               
                  blockCustomers.status='Activated'
                  console.log('customer activated');
              }
              await blockCustomers.save()
              res.redirect('/admin/customers') 
          }else{
              console.log('no logged in');
              res.redirect('/admin') 
          } 
      } catch (error) {
          console.log('get block customers error : '+ error);
      }
  }
  

  module.exports={
    get_customers,
    get_bolck_user,
    get_customers_refresh,
    post_search_customers,
    
}