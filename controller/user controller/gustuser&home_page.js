const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const WishlistCollection=require('../../model/user/wishlistSchema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const cartCollection =require('../../model/user/userCartSchema')
const ObjectId = require('mongodb').ObjectId;
const bannerSchema =  require('../../model/admin/admin_bannerSchema')

const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const { consumers } = require('nodemailer/lib/xoauth2')
const banners = require('../../model/admin/admin_bannerSchema')

//gust user
const gustuser = async(req,res)=>{
    const products= await allProducts.find({ isDeleted:false})
    res.render('user/gustuser',{title:'Gust User',products})
}
// home rout
// Modify the userHome function

const userHome = async (req, res) => {
    try {
        const username = req.session.user;
        // console.log('-----login user name:', username);

        if (req.session.logedIn) {
            const products = await allProducts.find({ isDeleted: false });
            const user = await customer.findOne({ username });
            const user_id = user._id;

            // Fetch the user's cart data
            const userCartData = await cartCollection.findOne({ userId: user._id });
            // console.log('------------------------userCartData', userCartData);

            // Declare cartProductIds outside the if block
            let cartProductIds = new Set();

            // Check if userCartData is not null and has 'Products'
            if (userCartData && userCartData.Products) {
                // Create a Set of productIds that are in the cart
                cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));
                // console.log('------------------------cartProductIds', cartProductIds);
            }

            const wishlist_ = await WishlistCollection.findOne({ User_Id: user._id });
            const wishlist = wishlist_ ? wishlist_.Products : [];
            //req.session.stockVariation ='' is used in the cart page and the confirm orderpage
            const banner = await bannerSchema.find({})
            console.log('*********************banner',banner[0].banner);
            req.session.stockVariation =''
            res.render('user/index', {
                title: 'Mobile Cart',
                products,
                username,
                wishlist,
                cartProductIds,
                banner,
            });
        } else {
            res.redirect('/gustuser');
        }
    } catch (error) {
        console.log('home error:-----------', error);
    }
};

const search = async (req,res)=>{
    try {
        const username =req.session.user

        const query = req.query.searchInput;
        // console.log('query =============',query);
        const results = await allProducts.find({ $text: { $search: new RegExp(query, 'i') } });
        let products_count= results.length
        let pageNumber = req.query.page?Number(req.query.page):0; 
        products_count = products_count/5
        let skip =pageNumber*5
        const products = results
        // console.log('searched data ===========',results);

        const user = await customer.findOne({ username });
        // console.log('------------------------userCartData', user);

        // Fetch the user's cart data
        const userCartData = await cartCollection.findOne({ userId: user._id });
        // console.log('------------------------userCartData', userCartData);

        // Declare cartProductIds outside the if block
        let cartProductIds = new Set();

        // Check if userCartData is not null and has 'Products'
        if (userCartData && userCartData.Products) {
            // Create a Set of productIds that are in the cart
            cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));
            // console.log('------------------------cartProductIds', cartProductIds);
        }
        const allcategorys = await categoryCollection.find({},{name:1,_id:0})
        const wishlist_ = await WishlistCollection.findOne({ User_Id: user._id });
        const wishlist = wishlist_ ? wishlist_.Products : [];
        res.render('user/userSearch',{username,title:'Search Data',products,allcategorys,cartProductIds,wishlist,products_count,pageNumber})
        // res.json({ success: true, results });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}



module.exports={
    userHome,
    gustuser,
    search,
}