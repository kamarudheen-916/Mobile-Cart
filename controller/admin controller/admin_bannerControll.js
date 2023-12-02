const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bannerSchema =  require('../../model/admin/admin_bannerSchema')
const bcrypt = require('bcrypt')

const get_banner = async(req,res)=>{
    try {
        
        res.render('admin/adminBanner',{title:'Admin Banners'})
    } catch (error) {
        console.log('get banner error',error);
    }
}

const addBannerSubmit = async (req, res) => {
    try {
        const banners = req.files;
        console.log('Body:', req.body);
        console.log('Banners:', banners);
        let allbanner_filename=[]
        if(banners.length>0){
           
            for (let i = 0; i < banners.length; i++) {
                allbanner_filename.push(banners[i].filename);
            
            }
        }
        const addBanner = await bannerSchema.insertMany({banner:allbanner_filename})
        console.log('addBAnener=====',addBanner);
        res.json({ success: true });
    } catch (error) {
        console.log('addBannerSubmit error:', error);
        res.json({ success: false });
    }
}




module.exports ={
    get_banner,
    addBannerSubmit,
}