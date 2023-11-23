const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../email&otp-Controller/emailController')
const bcrypt = require('bcrypt')


//signup get
const signup_get = async (req,res)=>{ 
    const username= req.session.user
    const duplicateMessage = req.session.duplicateUserNameMessage
    res.render('user/signUp',{title:'Mobile Cart Signup',username,duplicateMessage})

}

//user signup post and generate OTP
const userSignup_post_generate_otp = async (req,res)=>{
    try {
      const signUp_username = req.body.username
      const signup_email = req.body.email
      // console.log('--------------username:',signUp_username);
  
      const userdata = await userCollection.findOne({username:signUp_username})
      const username = userdata?userdata.username:""
      const userEmail = userdata?userdata.email:""
      // console.log('--------------mongodb Username:',username);
      if(signUp_username!==username && signup_email!==userEmail ){
          req.session.duplicateUserNameMessage = ''
          const userEmail = req.body.email
          req.session.newOtp = Number(sendMail(req,res,userEmail))
          req.session.user=req.body.username
          req.session.OTPerrorMessage = false;
          // console.log(req.session.user);
      
         req.session.signUp_userData={
              username:req.body.username,
              email:req.body.email,
              timeStamp: Date.now(),
              password:await bcrypt.hash(req.body.password,10)
          }
          
          // console.log(req.session.signUp_userData);
          req.session.userSignup=true
          res.redirect('/otp')
      }else{
          req.session.duplicateUserNameMessage = 'Username or Email already exists'
          res.redirect('/signup')
      }
     
    } catch (error) {
      console.log('user signUp error : ',error);
    }
  } 
module.exports ={
    signup_get,
    userSignup_post_generate_otp,
}