const express = require("express")
const router = express.Router()

const users= require('../model/user/userSchema')
const otpValidation = require('../auth/otpAuth')
const passport = require("passport")
require("../passport-google/passport.js")
const userAuth = require('../middleware/user_session')
const upload = require('../middleware/multer')

const loginControls = require('../controller/user controller/user_login_contrller')
const otpControls = require('../controller/user controller/get_and_post_otp')
const signUpControls = require('../controller/user controller/user_signupContrller')
const gustuser_home_Controll = require('../controller/user controller/gustuser&home_page')
const productDetails_Controll = require('../controller/user controller/productDetails')
const productList_Controll = require('../controller/user controller/productList_Controll')
const wishlist_controll =require('../controller/user controller/wishlist_controll')
const cartControll =require('../controller/user controller/cartControll')
const userProfileController = require('../controller/user controller/profileController')
const userOrderControll = require('../controller/user controller/OrderControll.js')
//--------------------------------------------------------------------------------
// user login route get
router.get('/login',userAuth.userExist,loginControls.userLogin)
// user login post
router.post('/login',userAuth.userExist,loginControls.userLogin_post)
//user fotget password
router.get('/login/forgetPassword',userAuth.userExist,loginControls.get_loginForget)
//user forget password post method
router.post('/login/forgetPassword',userAuth.userExist,loginControls.post_loginForget)
//--------------------------------------------------------------------------------------------
// user_login_otp_get
router.get('/otp',userAuth.userExist,otpControls.user_get_otp)
//user home redirect
router.post('/otp',userAuth.userExist,otpControls.userOtp_post)
//user resend otp
router.get('/user/otp/resend_otp',userAuth.userExist,otpControls.get_resendOTP)
//--------------------------------------------------------------------------------------
//user signup get
router.get('/signup',userAuth.userExist,signUpControls.signup_get) 
//user signup post
router.post('/signup',userAuth.userExist,signUpControls.userSignup_post_generate_otp)
//---------------------------------------------------------------------------------------

//-------------------------------------------------------------------------
//gust user
router.get('/gustuser',userAuth.userExist,gustuser_home_Controll.gustuser) 
// home route
router.get('/',userAuth.verifyuser,gustuser_home_Controll.userHome)
//user Search
router.get('/search',userAuth.verifyuser,gustuser_home_Controll.search)
//user logout
router.get('/logout',(req,res)=>{  req.session.logedIn=false; res.redirect('/') })
//--------------------------------------------------------------------------
//user product list 
router.get('/userProductList/:category',userAuth.verifyuser,productList_Controll.get_product_List)
router.get('/filterByCategory',userAuth.verifyuser,productList_Controll.filterByCategory)

//user product detailes
router.get('/productDetails/:id',userAuth.verifyuser,productDetails_Controll.get_productDetails)
//------------------------------------------------------------------------------------------
//user wishlist get 
router.get('/wishlist',userAuth.verifyuser,wishlist_controll.get_wishlist)
//add to wishlist 
router.post('/add-wishlist',userAuth.verifyuser,wishlist_controll.add_wishlist)
//Delete to wishlist 
router.delete('/delete-wishlist/:productId',userAuth.verifyuser,wishlist_controll.delete_wishlist)
//-----------------------------------------------------------------------------------------------
router.get('/get_cart',userAuth.verifyuser,cartControll.user_cart)
router.post('/add-addToCart/:count',userAuth.verifyuser,cartControll.add_to_Cart)
router.get('/removeFromCart/:productId',userAuth.verifyuser,cartControll.removeFromCart)
//------------------------------------------------------------------------------------------------
router.get('/get_profile',userAuth.verifyuser,userProfileController.user_profile_get)
router.get('/get_userAddress',userAuth.verifyuser,userProfileController.user_address_get)
router.post('/post_userAddress',userAuth.verifyuser,userProfileController.user_address_post)
router.post('/deletAddress/:addressId',userAuth.verifyuser,userProfileController.user_deleteAddress)
router.get('/editAddress/:addressId',userAuth.verifyuser,userProfileController.user_editAddress)
router.post('/post_editAddress/:id',userAuth.verifyuser,userProfileController.user_editAddress_post)
router.post('/post_userProfile_update',userAuth.verifyuser,upload.single('userProfile'),userProfileController.post_userProfile_update)
router.post('/get_profile/resetPassword',userAuth.verifyuser,userProfileController.resetPassword)
router.get('/coupons',userAuth.verifyuser,userProfileController.viewCoupon)


//--------------------------------------------------------------------------------------------------
router.get('/get_palceOrder',userAuth.verifyuser,userOrderControll.get_palceOrder)
router.get('/confirmOrderAndGetOrderSucess',userAuth.verifyuser,userOrderControll.get_confirmOrder)
router.post('/confirmOrder',userAuth.verifyuser,userOrderControll.confirmOrder)
router.post('/verify-payment',userAuth.verifyuser,userOrderControll.verify_payment)
router.post('/applyCoupon',userAuth.verifyuser,userOrderControll.applyCoupon)
//--------------------------------------------------------------------------------------------------
router.get('/get_Orders',userAuth.verifyuser,userOrderControll.get_Orders)
router.post('/removeOrder/:ProductId',userAuth.verifyuser,userOrderControll.post_remove_Orders)
router.get('/get_OrderDetails/:id',userAuth.verifyuser,userOrderControll.get_OrderDetails)
router.get('/getInvoice/:OrderId',userAuth.verifyuser,userOrderControll.getInvoice)
router.post('/returnOrder/:OrderId',userAuth.verifyuser,userOrderControll.post_returnOrder)




module.exports= router;