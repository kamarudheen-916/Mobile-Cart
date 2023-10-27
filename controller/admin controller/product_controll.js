const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')


const get_product = async(req,res)=>{
    try {
        let searched= false
        const categories = await categoryCollection.find()
        if(req.session.adminLoggedin){
            if(  req.session.searched){
                 searched = req.session.searched
                const products2 = req.session.searchData
                
                let pageNumber = req.query.page?Number(req.query.page):0;
                let skip = pageNumber *5
                let limit = 5*(pageNumber+1)
                let products = products2.slice(skip,limit)                          
                console.log('-------------------products-count',products);
                
                let products_count = products2.length
                products_count = (products_count/5)
                res.render('admin/adminProducts',{title:'Admin Product Page',products,searched,categories,products_count})
            }else{
                let pageNumber = req.query.page?Number(req.query.page):0;               
                let products_count = await allProducts.find().count()
                console.log('---------------------',products_count);
                products_count = products_count/5              
                let skip = pageNumber *5
                const products = await allProducts.find().skip(skip).limit(5)
                res.render('admin/adminProducts',
                {
                    title:'Admin Product Page',
                    products,
                    searched,
                    categories,
                    products_count})
            }
         
        }else{
            res.redirect('/admin')
        }
    } catch (error) {
        console.log('product get method error:----',error);
    }
    }
    
  

//admin add new products
const get_add_new_products = async(req,res)=>{
    try {
        const categories = await categoryCollection.find()
        console.log(categories);
        res.render('admin/adminAddProducts',{title:'Admin Add New Products',categories})
        
    } catch (error) {
        console.log('add new product error get :---',error);        
    }
}

//admin add new products post method
const post_add_new_products =async (req,res,next)=>{
    try {
        console.log('reached  ++++');
        const allImages = req.files;
        let allImages_filename=[];
        for(let i =0;i<allImages.length;i++){
            allImages_filename[i]=allImages[i].filename
        }
   
        console.log('check  ++++');   
        console.log('Uploaded files ------------');
        
        const productData =
        {
            name:req.body.name,
            category:req.body.category,
            Highlight1:req.body.Highlight1,
            Highlight2:req.body.Highlight2,
            Highlight3:req.body.Highlight3,
            Highlight4:req.body.Highlight4,
            Highlight5:req.body.Highlight5,
            Highlight6:req.body.Highlight6,
            description:req.body.description,
            price:req.body.price,
            stock:req.body.stock,
            timeStamp:Date.now(),
            image:allImages_filename
           
        }

        
        // console.log('Image is ------------------ :' , productData.image);
        console.log('date :',productData.timeStamp);
        await allProducts.insertMany([productData])
       
        console.log('new products:',productData);
        res.redirect('/admin/products')  
    } catch (error) {
        console.error("Error during file upload:", error);
        // Handle the error appropriately
    }

}
//admin product search 

const post_product_search = async (req,res)=>{
    try {
        let i=0
       
        // const products = await allProducts.find().skip(skip).limit(5)
        const searchData = req.body.search
   
    const searchProductData = await allProducts.find({name:{$regex:"^"+searchData,$options:'i'}})
    console.log(`----------${searchProductData}`);
    req.session.searchData = searchProductData;
    req.session.searched = true;
    res.redirect('/admin/products') 
    } catch (error) {
        console.log('search error ------------:' , error);
    }
    
}
//admin product refresh 
const get_productRefresh = async (req,res)=>{
    try {
        req.session.searched=false
        res.redirect('/admin/products')
    } catch (error) {
        console.log('refresh is not working');
    }

}

//admin edit product get    
const get_edit_product = async(req,res)=>{
    try {
        let productId = req.params.id
    const products = await allProducts.findOne({_id:productId})
    const categories = await categoryCollection.find()
    res.render('admin/adminProductEdit',{title:'Edit Product',products,categories},)
    } catch (error) {
        console.log('edit product get method error:----',error);
    }
} 
//admin edit product(update)
const post_edit_product = async(req,res)=>{
         try {
            let productId=req.params.id; 
            let allImages_filename=[]
            let noImage;
            const allImages = req.files;
            console.log('---------------allImages_filename',allImages);
            if(allImages.length>0){
               
                for (let i = 0; i < allImages.length; i++) {
                  allImages_filename.push(allImages[i].filename);
                
                }
            }

        await allProducts.updateOne({_id:productId},
            {$set:
                {
                    name:req.body.name,
                    category:req.body.category,
                    Highlight1:req.body.Highlight1,
                    Highlight2:req.body.Highlight2,
                    Highlight3:req.body.Highlight3,
                    Highlight4:req.body.Highlight4,
                    Highlight5:req.body.Highlight5,
                    Highlight6:req.body.Highlight6,
                    description:req.body.description,
                    price:req.body.price,
                    stock:req.body.stock,
                    timeStamp:Date.now(),
                    image: allImages_filename.length > 0 ? allImages_filename : req.body.image,

        }})
        console.log('update image : ---------------',req.files);
        res.redirect('/admin/products')  
    } catch (error) {
        console.error("Error during file upload:", error);
        // Handle the error appropriately
    }

}

//admin delete product
const get_delete_product = async(req,res)=>{
    try {
        const deleteProductId=req.params.id;
        const deleteProduct = await allProducts.findOne({_id:deleteProductId})
        const isProductDeleted= deleteProduct.isDeleted;
        console.log('-------------'+isProductDeleted);
        // isProductDeleted=!isProductDeleted
        deleteProduct.isDeleted =!deleteProduct.isDeleted
       
        if(isProductDeleted){
            deleteProduct.status = 'Activated'

            console.log('product has been restored');

        }else{
            deleteProduct.status = 'Deactivated'

            console.log('product has been soft deleted');
        }
        await deleteProduct.save();
        res.redirect('/admin/products') 

    } catch (error) {
        console.log('soft delete error:'+error );
    }
}


module.exports={
    get_product,
    get_add_new_products,
    post_add_new_products,
    get_edit_product,
    post_edit_product,
    get_delete_product,
    post_product_search,
    get_productRefresh,

}