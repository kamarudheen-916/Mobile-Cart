const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')

//admin get categories
const get_categories = async(req,res)=>{
    try {
        if(req.session.adminLoggedin){
            let  searched =false
        if(req.session.categorySearched){
             searched = req.session.categorySearched
             const categories =req.session.searchCategoryData
            res.render('admin/adminCategory',{title:'Admin Category',categories,searched})
        }else{
            req.session.duplicate_category_name=false
            const categories = await categoryCollection.find()
            res.render('admin/adminCategory',{title:'Admin Category',categories,searched})
        }
       
        }
        else{
            res.redirect('/admin')
        }
        
    } catch (error) {
        console.log('get category error -------------',error);
    }
   
}

//admin get add_new categor
const add_new_category = async(req,res)=>{
    try {
        if(req.session.adminLoggedin){
           const duplicate_category_name =req.session.duplicate_category_name?'The category is existing':''
            res.render('admin/adminAddCategory',{title:'Admin Add Category',duplicate_category_name})
        }else{
         console.log('admin not logged in '); 
         res.redirect('/admin')  
        }
    } catch (error) {
        console.log('add category error : ',error);
    }
    
}
//admin post add new category
const post_add_new_categories =  async (req,res)=>{
    try {
        if(req.session.adminLoggedin){
            const categoryData = {
                name:req.body.name,
                description:req.body.description,
                timeStamp: Date.now()
                
            }
            const old_category = await categoryCollection.findOne({name:categoryData.name})
            if(old_category){
                req.session.duplicate_category_name = true 
                res.redirect('/admin/add-new-catogeries')
            }else{
                console.log('----------categoryData:',categoryData);
                await categoryCollection.create(categoryData)
                
                res.redirect('/admin/categories')
            }
          
        }else{
            res.redirect('/admin')
        }
    } catch (error) {
        console.log('admin add new category error :',error);
    }

}

//admin get_block_category
const get_block_category = async (req,res)=>{
    
    try {
        console.log('-------------test');
        if(req.session.adminLoggedin){
            const categoryId = req.params.id
            const categoryData= await categoryCollection.findById(categoryId)
            console.log('------------categoryData:',categoryData); 
            categoryData.isBlocked= !categoryData.isBlocked
            if(categoryData.isBlocked){
                categoryData.status ='Blocked'
            }else{
                categoryData.status = 'Activate'
            }
            await categoryData.save();
            res.redirect('/admin/categories')
        }else{
            res.redirect('/admin')
        }
    } catch (error) {
        console.log('the block category is not working:',error);
    }
}
//catogery search 
const   post_search_catogery = async (req,res)=>{
    try {
        let i=0;
        if(req.session.adminLoggedin){
            const searchData = req.body.search
            console.log('-------------------searchData',searchData);
            const searchCategoryData = await categoryCollection.find
            (
                {name:{$regex:'^'+searchData,$options:'i'}}
            )
                console.log(searchCategoryData);
            req.session.searchCategoryData= searchCategoryData
            req.session.categorySearched = true
            res.redirect('/admin/categories')
            console.log('-----------test');
        }else{
            console.log('admin not loggedIn');
            res.redirect('/admin')
        }
    } catch (error) {
        console.log('--------------------search category error:',error)
    }
}
const get_category_Refresh = async (req,res)=>{
    try {
        req.session.categorySearched=false
        res.redirect('/admin/categories')
    } catch (error) {
        console.log('refresh is not working');
    }

}
module.exports={
    get_categories,
    add_new_category,
    post_add_new_categories,
    get_block_category,
    post_search_catogery,
    get_category_Refresh,
   
    
}