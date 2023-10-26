const router= require('express').Router()
const passport=  require('passport');
const users = require('../model/user/userSchema');
require('dotenv').config() 

router.get('/login/success',(req,res)=>{
        if(req.user){
            req.status(200).json({
                error:false,
                message:'Successfully Loged in',
                user:req.user
            })
        }else{
            req.status(403).json({error:true,message:'Not Authorized'})
        }
})

router.get('/login/failed',(req,res)=>{
    res.status(401).json({
        error:true,
        message:'Log In failure'
       
    })
    console.log('----------------------------------');
})


/////////////////////////////////////////////////////

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback",(req, res, next) => {
    passport.authenticate("google", async(err, user, info) => {
        try{
            console.log("here at call back");
            console.log("user data :",user);
            console.log("some information is comming to call back:",info);
    
          if (err) {
            // Handle error
            console.error("Error during Google authentication:", err);
            req.flash("errmsg","please try again")
  
            return res.redirect("/login"); // Redirect to an error page
          }
       
          if (!user) {
            // Handle authentication failure
            console.error("Authentication failed:", info.message);
            req.flash("errmsg","existing user,please login")
            req.session.googleExistingUser =true
            return res.redirect("/login"); // Redirect to a failure page
          }
          console.log(user);
          let userInformation = {
            username: user.displayName,
            email: user.emails[0].value,
            profile: user.photos[0].value,
            status:"Active",
            timeStamp:Date.now(),
          };
          console.log(userInformation);
    
          const insert=await users.insertMany([userInformation])
    
          if(insert){
            console.log("inserted");
            // Manually set a session variable with user data
          req.session.useremail = user.emails[0].value;
      
          // Redirect to the desired page (e.g., /setSession)
          req.session.logedIn=true
          req.session.user=user.displayName
          req.session.googleExistingUser =false
           res.redirect("/");
          }
        }catch(err){
            console.log("vere enthele.-----------------------..............................",err);
        }
    }) (req, res, next);// Invoke the Passport middleware
  });



router.get('/logout',(req,res)=>{
    req.logout()
    req.redirect(process.env.CLIENT_URL);
})

///////////////////////////////////////////////////////////
router.get('/googleLogin', passport.authenticate('google-login', { scope: ['profile', 'email'] }));
router.get("/google-login/callback",(req, res, next) => {
  passport.authenticate("google-login", async(err, user, info) => {
      try{
        if(!req.session.logedIn){
          console.log("-------------------here at call back");
          console.log("user data :",user);
          console.log("some information is comming to call back:",info);
  
        if (err) {
          // Handle error
          console.error("Error during Google authentication:", err);
          req.flash("errmsg","please try again")

          return res.redirect("/login"); // Redirect to an error page
        }
     
        if (!user) {
          // Handle authentication failure
          console.error("Authentication failed:", info.message);
          req.flash("errmsg","existing user,please login")
          return res.redirect("/login"); // Redirect to a failure page
        }
        console.log('---------------user:',user);
        let userInformation = {
          username: user.displayName,
          email: user.emails[0].value,
          profile: user.photos[0].value,
          status:"Active",
          timeStamp:Date.now(),
        };
        console.log(userInformation);
  
        // const insert=await users.insertMany([userInformation])
        const username = await users.findOne({username:userInformation.username})
        if(username){
          console.log("goole login successfull");
          // Manually set a session variable with user data
        req.session.useremail = user.emails[0].value;
    
        // Redirect to the desired page (e.g., /setSession)
        req.session.logedIn=true
        req.session.user=user.displayName
         res.redirect("/");
        }
      }else{
        console.log('google sign error------------');
        res.redirect('/login')
      }}
      catch(err){
          console.log("vere enthele.-----------------------..............................",err);
      }
  }) (req, res, next);// Invoke the Passport middleware
});


module.exports = router