const customer = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const WishlistCollection=require('../../model/user/wishlistSchema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const cartCollection =require('../../model/user/userCartSchema')
const ObjectId = require('mongodb').ObjectId;

const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const { consumers } = require('nodemailer/lib/xoauth2')

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
        console.log('-----login user name:', username);

        if (req.session.logedIn) {
            const products = await allProducts.find({ isDeleted: false });
            const user = await customer.findOne({ username });
            const user_id = user._id;

            // Fetch the user's cart data
            const userCartData = await cartCollection.findOne({ userId: user._id });

            // Create a Set of productIds that are in the cart
            const cartProductIds = new Set(userCartData.Products.map(item => item.ProductId.toString()));

            const wishlist_ = await WishlistCollection.findOne({ User_Id: user._id });
            const wishlist = wishlist_ ? wishlist_.Products : [];

            res.render('user/index', {
                title: 'Mobile Cart',
                products,
                username,
                wishlist,
                cartProductIds,
            });
        } else {
            res.redirect('/gustuser');
        }
    } catch (error) {
        console.log('home error:-----------', error);
    }
};



module.exports={
    userHome,
    gustuser,
}