const express = require("express")
const router = express.Router()

const users= require('../model/user/userSchema')
const otpValidation = require('../auth/otpAuth')
const passport = require("passport")
require("../passport-google/passport.js")
const userAuth = require('../middleware/user_session')

const loginControls = require('../controller/user controller/user_login_contrller')
const otpControls = require('../controller/user controller/get_and_post_otp')
const signUpControls = require('../controller/user controller/user_signupContrller')
const gustuser_home_Controll = require('../controller/user controller/gustuser&home_page')
const productDetails_Controll = require('../controller/user controller/productDetails')
const productList_Controll = require('../controller/user controller/productList_Controll')
const wishlist_controll =require('../controller/user controller/wishlist_controll')

//--------------------------------------------------------------------------------
//user product detailes
router.get('/productDetails/:id',userAuth.verifyuser,productDetails_Controll.get_productDetails)

//--------------------------------------------------------------------------
//user product list 
router.get('/userProductList/:category',userAuth.verifyuser,productList_Controll.get_product_List)
//------------------------------------------------------------------------
//user wishlist get 
router.get('/wishlist',userAuth.verifyuser,wishlist_controll.get_wishlist)

//add to wishlist 
router.post('/add-wishlist',userAuth.verifyuser,wishlist_controll.add_wishlist)
//Delete to wishlist 
router.delete('/delete-wishlist/:productId',userAuth.verifyuser,wishlist_controll.delete_wishlist)

//-----------------------------------------------------------------------------------------------
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
//user logout
router.get('/logout',(req,res)=>{  req.session.logedIn=false; res.redirect('/') })




module.exports= router;