const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sharp=require('sharp')
const path = require('path')
const fs = require('fs')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const bannerSchema =  require('../../model/admin/admin_bannerSchema')
const bcrypt = require('bcrypt')
const { log } = require('console')

const get_banner = async(req,res)=>{
    try {
        const banner = await (await bannerSchema.find({})).reverse()
        let banners = []
        console.log('banner------------',banner);
        if(banner.length > 0){
             banners =  banner[0].banner
        }
        else{
             banners = []
        }
       
        res.render('admin/adminBanner',{title:'Admin Banners',banners})
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

        

       
       
        const savePath = path.join(__dirname, '../../public/bannerImages/bannerCropedImage');
       
        console.log(savePath, "!!!!!!!!!!!!!!!!!");
      
        // allbanner_filename.push(fileName);
        if(banners.length>0){
           
            for (let i = 0; i < banners.length; i++) {
                const imageBuffer = fs.readFileSync(banners[i].path);
                const croppedImageBuffer = await sharp(imageBuffer)
                .resize({ width: 1050, height: 579, fit: sharp.fit.cover })
                .toBuffer();
                console.log(croppedImageBuffer, "image cropp image success................................");
                const fileName = banners[i].filename;
                fs.writeFileSync(path.join(savePath,fileName), croppedImageBuffer);
                allbanner_filename.push(fileName);
                
            
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