
const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')

const sendMail =require('../email&otp-Controller/emailController')

const bcrypt = require('bcrypt')


//user login get
const userLogin =async (req,res)=>{ 
        //  req.session.noUser = 'Incorect User Name Or Password';
        let isBlocked_message=false
        let noUser_message= false
        let googleExistingUser = req.session.googleExistingUser
        if(req.session.isBlocked){
            const username= req.session.user
            isBlocked_message=true;
            res.render('user/login',{title:'User Login',username,isBlocked_message ,noUser_message,googleExistingUser})
       
        }else if(req.session.noUser){ 
            const username= req.session.user
            noUser_message=true;
            // console.log('incorrect password--------------------');
            res.render('user/login',{title:'User Login',username,isBlocked_message ,noUser_message,googleExistingUser})
        }else{
            const username= req.session.user
            res.render('user/login',{title:'User Login',username,isBlocked_message ,noUser_message,googleExistingUser})
        }
        // console.log('----------is bloked:---',isBlocked);
        
   
    
    }


///////////////////////////////////////////////////////////////////////////////////

// user login post
const userLogin_post = async(req,res)=>{
    req.session.logedIn=false
    const username = req.body.username;
    const user = await userCollection.findOne({username})   
    if(user){
        if(user.isBlocked){
            req.session.isBlocked=true
            res.redirect('/login')
        }else{
        bcrypt.compare(req.body.password,user.password).then((status)=>{
            if(status)
            {
                console.log('login success');
                req.session.user=req.body.username 
                req.session.logedIn=true
                const userEmail = user.email
                req.session.userEmail = userEmail;
                // localStorage.setItem("UserEmail", userEmail);

                // req.session.newOtp = Number(sendMail(req,res,userEmail))
                // console.log('-----------------neqwOtp :',req.session.newOtp);
                req.session.userSignup=false
                req.session.noUser =false;
                
                res.redirect('/')
                // res.redirect('/otp')

            }else{
                console.log('login failed');
                req.session.noUser = true;  
                res.redirect('/login')
            }
        }).catch((err)=>{
            console.log("login error is :"+ err);
            
        })
    }
    }else{
        console.log('login failed due to no user');
        req.session.noUser = true;
        res.redirect('/login')
    }
    console.log(user);

}
//user login forget password get
const get_loginForget = async(req,res)=>{
    try {

        const username= req.session.user
        const resetPasswordMessage= req.session.resetPasswordMessage
        res.render('user/forgetPassword',{title:'Forget Password',username,resetPasswordMessage})
    } catch (error) {
        console.log('forget password page does not find : error : ',error);
    }
}
//user login forget password post method
const post_loginForget = async (req,res)=>{
    try {
        const username =  req.body.username
        const  newPassword=await bcrypt.hash(req.body.password,10)
         await userCollection.updateOne({username},{$set:{password:newPassword}})
         req.session.resetPasswordMessage= 'Successful'
        res.redirect('/login/forgetPassword')
    } catch (error) {
        console.log('forget password post method error: ',error);
    }
}

module.exports = {
    userLogin,
    userLogin_post,
    get_loginForget,
    post_loginForget,
}