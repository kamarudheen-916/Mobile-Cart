const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../email&otp-Controller/emailController')
const bcrypt = require('bcrypt')

//user get otp
const user_get_otp =(req,res)=>{
    const username = req.session.username
    const OTPmessage = req.session.OTPerrorMessage
    res.render('user/otp',{title:'Enter OTP',username,OTPmessage}
    )}
//////////////////////////////////////////
//user home redirect and otp post method
const userOtp_post =async (req,res)=>{  
    req.session.logedIn=false;
    try {
        const arr =[]
        arr.push(req.body.otp1)
        arr.push(req.body.otp2)
        arr.push(req.body.otp3)
        arr.push(req.body.otp4)
        //takig the user entered otp
        let fullOtp= arr.map(Number)
        fullOtp=Number(arr.join("")) 
        console.log('full otp :'+typeof(fullOtp)+':'+fullOtp)
        if(fullOtp===  req.session.newOtp){
           // const newUser = new userCollection(signUp_userData)
           if(req.session.userSignup){
            signUp_userData=req.session.signUp_userData
            await userCollection.insertMany([signUp_userData])
        }
            req.session.logedIn=true
            
            console.log('---------------'+req.session.logedIn);
            res.redirect('/')
        }else{
            req.session.OTPerrorMessage = true;
            res.redirect('/otp')
            console.log('An Error Occured');
        }
    } catch (error) {
        console.log(error);
    } 
   
}

//user resend OTP get
const get_resendOTP = (req,res)=>{
    try {
        email= req.session.userEmail;
        console.log('--------------------------------Email resend otp',email);
        req.session.newOtp = Number(sendMail(req,res,email))
       console.log('resend otp successful');
       res.redirect('/otp')
    } catch (error) {
       
    }
}

module.exports ={
    user_get_otp,
    userOtp_post,
    get_resendOTP,
}