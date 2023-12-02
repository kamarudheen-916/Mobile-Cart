
const mongoose =require('mongoose')
require('../../config/DBconnection')

const bannerSchema = new mongoose.Schema({
        banner :[{type:String}]
    })
    const banners= mongoose.model('banners',bannerSchema)
    module.exports =banners;