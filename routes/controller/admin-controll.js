// const customer = require('../../model/user/userSchema')
// const allProducts=require('../../model/admin/productSchema')
// const admin = require('../../model/admin/admin_Schema')
// const categoryCollection = require('../../model/admin/admin_categorySchema')
// const bcrypt = require('bcrypt')
// const { forEach } = require('lodash')



// // //logi get
// // const admin_login = async (req,res)=>{
// //     let admin = req.session.adminLoggedin
// //     if(admin){
// //         res.redirect('/admin/dashbord')
// //     }else{
// //    res.render('admin/adminLogin',{title:'Admin Login'})
// //     }
// // }

// // //admin logout
// // const admin_logout =(req,res)=>{
// //     try {
// //         res.session.destroy();
// //         res.redirect('/admin')
// //     } catch (error) {
// //         console.log('-----------admin logout error',error);
// //     }
  
// // }

// // //login post
// // const admin_login_post = async(req,res)=>{

// //     const username = req.body.username
// //    const admindata = await admin.findOne({username});
    
// //    console.log("admin:------",admindata);
// //     if(admindata){
// //        bcrypt.compare(req.body.password,admindata.password).then((status)=>{
// //         if (status) {
// //             console.log('admin login success');
// //         req.session.adminName=req.body.username 
// //         req.session.adminLoggedin=true
// //         // res.render('admin/adminProducts',{title:'Admin Products',products})
// //         res.redirect('/admin/dashbord')
// //         } else {
// //             console.log('login failed');
// //         }
// //     }).catch((error)=>{
// //         console.log('admin login error : '+error);
// //     })
// //     }else{
// //         console.log('login failed due to no user');
// //     }
// // }

// //admin dashbord get
// // const get_dashbord=async(req,res)=>{
// //     const admin = req.session.adminLoggedin
// //     if(admin){
// //         res.render('admin/adminDashbord',{title:'Admin Dashbord'})
// //     }else{
// //         res.redirect('/admin') 
// //     }
   
// // }

// //admin product page get

// // const get_product = async(req,res)=>{
// //     let searched= false
// //     if(req.session.adminLoggedin){
// //         if(  req.session.searched){
// //              searched = req.session.searched
// //             const products = req.session.searchData
// //             res.render('admin/adminProducts',{title:'Admin Product Page',products,searched})
// //         }else{
            
// //             const products = await allProducts.find()
// //             res.render('admin/adminProducts',{title:'Admin Product Page',products,searched})
// //         }
     
// //     }else{
// //         res.redirect('/admin')
// //     }
// //     }
    

// // //admin add new products
// // const get_add_new_products = (req,res)=>{
// //     res.render('admin/adminAddProducts',{title:'Admin Add New Products'})
// // }

// // //admin add new products post method
// // const post_add_new_products =async (req,res,next)=>{
// //     try {
// //         console.log('reached  ++++');
// //         const allImages = req.files;
// //         let allImages_filename=[];
// //         for(let i =0;i<allImages.length;i++){
// //             allImages_filename[i]=allImages[i].filename
// //         }
   
// //         console.log('check  ++++');   
// //         console.log('Uploaded files ------------');
// //         // console.log('The Image ---------------- -',allImages);  
      

// //         const productData =
// //         {
// //             name:req.body.name,
// //             category:req.body.category,
// //             Highlight1:req.body.Highlight1,
// //             Highlight2:req.body.Highlight2,
// //             Highlight3:req.body.Highlight3,
// //             Highlight4:req.body.Highlight4,
// //             Highlight5:req.body.Highlight5,
// //             Highlight6:req.body.Highlight6,
// //             description:req.body.description,
// //             price:req.body.price,
// //             stock:req.body.stock,
// //             timeStamp:Date.now(),
// //             image:allImages_filename
           
// //         }

        
// //         // console.log('Image is ------------------ :' , productData.image);
// //         console.log('date :',productData.timeStamp);
// //         await allProducts.insertMany([productData])
       
// //         console.log('new products:',productData);
// //         res.redirect('/admin/products')  
// //     } catch (error) {
// //         console.error("Error during file upload:", error);
// //         // Handle the error appropriately
// //     }

// // }
// // //admin product search 

// // const post_product_search = async (req,res)=>{
// //     try {
// //         let i=0
// //         const searchData = req.body.search
// //     console.log('------------------',searchData);
// //     const searchProductData = await allProducts.find({name:{$regex:"^"+searchData,$options:'i'}})
// //     console.log(`----------${searchProductData}`);
// //     req.session.searchData = searchProductData;
// //     req.session.searched = true;
// //     res.redirect('/admin/products') 
// //     } catch (error) {
// //         console.log('search error ------------:' , error);
// //     }
    
// // }
// // //admin product refresh 
// // const get_productRefresh = async (req,res)=>{
// //     try {
// //         req.session.searched=false
// //         res.redirect('/admin/products')
// //     } catch (error) {
// //         console.log('refresh is not working');
// //     }

// // }

// // //admin edit product get    
// // const get_edit_product = async(req,res)=>{
// //     let productId = req.params.id
// //     const products = await allProducts.findOne({_id:productId})
    
// //     res.render('admin/adminProductEdit',{title:'Edit Product',products},)
// // } 
// // //admin edit product(update)
// // const post_edit_product = async(req,res)=>{
// //          try {
// //             let productId=req.params.id;  
// //         await allProducts.updateOne({_id:productId},
// //             {$set:
// //                 {
// //                     name:req.body.name,
// //                     category:req.body.category,
// //                     Highlight1:req.body.Highlight1,
// //                     Highlight2:req.body.Highlight2,
// //                     Highlight3:req.body.Highlight3,
// //                     Highlight4:req.body.Highlight4,
// //                     Highlight5:req.body.Highlight5,
// //                     Highlight6:req.body.Highlight6,
// //                     description:req.body.description,
// //                     price:req.body.price,
// //                     stock:req.body.stock,
// //                     timeStamp:Date.now(),
// //                     image:req.file,

// //         }})
// //         console.log('update image : ---------------',req.file);
// //         res.redirect('/admin/products')  
// //     } catch (error) {
// //         console.error("Error during file upload:", error);
// //         // Handle the error appropriately
// //     }

// // }

// // //admin delete product
// // const get_delete_product = async(req,res)=>{
// //     try {
// //         const deleteProductId=req.params.id;
// //         const deleteProduct = await allProducts.findOne({_id:deleteProductId})
// //         const isProductDeleted= deleteProduct.isDeleted;
// //         console.log('-------------'+isProductDeleted);
// //         // isProductDeleted=!isProductDeleted
// //         deleteProduct.isDeleted =!deleteProduct.isDeleted
       
// //         if(isProductDeleted){
// //             deleteProduct.status = 'Activated'

// //             console.log('product has been restored');

// //         }else{
// //             deleteProduct.status = 'Deactivated'

// //             console.log('product has been soft deleted');
// //         }
// //         await deleteProduct.save();
// //         res.redirect('/admin/products') 

// //     } catch (error) {
// //         console.log('soft delete error:'+error );
// //     }
// // }

// // //admin get customers page
// // const get_customers = async (req,res)=>{
    
// //   try {
// //     let searched= false
// //     if(req.session.adminLoggedin){
// //         if(  req.session.customerSearched){ 
// //              searched = req.session.customerSearched
// //             const customers = req.session.searchCustomerData
// //             res.render('admin/adminCustomers',{title:'Admin  Customers Page',customers,searched})
// //         }else{
            
// //             const customers = await customer.find()
// //             res.render('admin/adminCustomers',{title:'Admin  Customers Page',customers,searched})
// //         }
     
// //     }else{
// //         res.redirect('/admin')
// //     }
    
// //   } catch (error) {
// //     console.log('get customers error:'+error)
// //   }    
// // }

// // //catogery search 
// // const   post_search_customers = async (req,res)=>{
// //     try {
// //         let i=0;
// //         if(req.session.adminLoggedin){
// //             const searchData = req.body.search
// //             console.log('-------------------searchData',searchData);
// //             const searchCustomerData = await customer.find
// //             (
// //                 {username:{$regex:'^'+searchData,$options:'i'}}
// //             )
// //                 console.log(searchCustomerData);
// //             req.session.searchCustomerData= searchCustomerData
// //             req.session.customerSearched = true
// //             res.redirect('/admin/customers')
// //             console.log('-----------test');
// //         }else{
// //             console.log('admin not loggedIn');
// //             res.redirect('/admin')
// //         }
// //     } catch (error) {
// //         console.log('--------------------search customers error:',error)
// //     }
// // }
// // const get_customers_refresh = async (req,res)=>{
// //     try {
// //         req.session.customerSearched=false
// //         res.redirect('/admin/customers')
// //     } catch (error) {
// //         console.log('refresh is not working');
// //     }

// // }

// // //admin block customers
// // const get_bolck_user = async (req,res)=>{
// //     try {
// //         if(req.session.adminLoggedin){
// //             const userBlockId = req.params.id
// //             const blockCustomers = await customer.findOne({_id:userBlockId})
// //             blockCustomers.isBlocked = !blockCustomers.isBlocked
// //             if(blockCustomers.isBlocked){
// //                 blockCustomers.status='Blocked'
// //                 console.log('customer blocked')
// //             }else{
             
// //                 blockCustomers.status='Activated'
// //                 console.log('customer activated');
// //             }
// //             await blockCustomers.save()
// //             res.redirect('/admin/customers') 
// //         }else{
// //             console.log('no logged in');
// //             res.redirect('/admin') 
// //         } 
// //     } catch (error) {
// //         console.log('get block customers error : '+ error);
// //     }
// // }

// //admin get categories
// const get_categories = async(req,res)=>{
//     try {
//         if(req.session.adminLoggedin){
//             let  searched =false
//         if(req.session.categorySearched){
//              searched = req.session.categorySearched
//              const categories =req.session.searchCategoryData
//             res.render('admin/adminCategory',{title:'Admin Category',categories,searched})
//         }else{
//             const categories = await categoryCollection.find()
//             res.render('admin/adminCategory',{title:'Admin Category',categories,searched})
//         }
       
//         }
//         else{
//             res.redirect('/admin')
//         }
        
//     } catch (error) {
//         console.log('get category error -------------',error);
//     }
   
// }

// //admin get add_new categor
// const add_new_category = async(req,res)=>{
//     try {
//         if(req.session.adminLoggedin){
//            const duplicate_category_name =req.session.duplicate_category_name?'The category is existing':''
//             res.render('admin/adminAddCategory',{title:'Admin Add Category',duplicate_category_name})
//         }else{
//          console.log('admin not logged in '); 
//          res.redirect('/admin')  
//         }
//     } catch (error) {
//         console.log('add category error : ',error);
//     }
    
// }
// //admin post add new category
// const post_add_new_categories =  async (req,res)=>{
//     try {
//         if(req.session.adminLoggedin){
//             const categoryData = {
//                 name:req.body.name,
//                 description:req.body.description,
//                 timeStamp: Date.now()
                
//             }
//             const old_category = await categoryCollection.findOne({name:categoryData.name})
//             if(old_category){
//                 req.session.duplicate_category_name = true 
//                 res.redirect('/admin/add-new-catogeries')
//             }else{
//                 console.log('----------categoryData:',categoryData);
//                 await categoryCollection.create(categoryData)
                
//                 res.redirect('/admin/categories')
//             }
          
//         }else{
//             res.redirect('/admin')
//         }
//     } catch (error) {
//         console.log('admin add new category error :',error);
//     }

// }

// //admin get_block_category
// const get_block_category = async (req,res)=>{
    
//     try {
//         console.log('-------------test');
//         if(req.session.adminLoggedin){
//             const categoryId = req.params.id
//             const categoryData= await categoryCollection.findById(categoryId)
//             console.log('------------categoryData:',categoryData); 
//             categoryData.isBlocked= !categoryData.isBlocked
//             if(categoryData.isBlocked){
//                 categoryData.status ='Blocked'
//             }else{
//                 categoryData.status = 'Activate'
//             }
//             await categoryData.save();
//             res.redirect('/admin/categories')
//         }else{
//             res.redirect('/admin')
//         }
//     } catch (error) {
//         console.log('the block category is not working:',error);
//     }
// }
// //catogery search 
// const   post_search_catogery = async (req,res)=>{
//     try {
//         let i=0;
//         if(req.session.adminLoggedin){
//             const searchData = req.body.search
//             console.log('-------------------searchData',searchData);
//             const searchCategoryData = await categoryCollection.find
//             (
//                 {name:{$regex:'^'+searchData,$options:'i'}}
//             )
//                 console.log(searchCategoryData);
//             req.session.searchCategoryData= searchCategoryData
//             req.session.categorySearched = true
//             res.redirect('/admin/categories')
//             console.log('-----------test');
//         }else{
//             console.log('admin not loggedIn');
//             res.redirect('/admin')
//         }
//     } catch (error) {
//         console.log('--------------------search category error:',error)
//     }
// }
// const get_category_Refresh = async (req,res)=>{
//     try {
//         req.session.categorySearched=false
//         res.redirect('/admin/categories')
//     } catch (error) {
//         console.log('refresh is not working');
//     }

// }
// module.exports={
//     // admin_login,
//     // admin_login_post,
//     // get_dashbord,
//     // get_product,
//     // get_add_new_products,
//     // post_add_new_products,
//     // get_customers,
//     get_categories,
//     add_new_category,
//     // admin_logout ,
//     // get_edit_product,
//     // post_edit_product,
//     // get_delete_product,
//     // post_product_search,
//     // get_bolck_user,
//     // get_productRefresh,
//     post_add_new_categories,
//     get_block_category,
//     post_search_catogery,
//     get_category_Refresh,
//     // get_customers_refresh,
//     // post_search_customers,
    
// }