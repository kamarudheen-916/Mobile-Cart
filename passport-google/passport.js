const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passport = require('passport');
const users = require('../model/user/userSchema');
require('dotenv').config()  
passport.use(
    'google',
    new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async function (req, accessToken, refreshToken, profile, done) {
        try{
            console.log("===============================================================================================");
            const email=profile.emails[0].value
            const exist= await users.findOne({email:email});
            console.log('--------exist',exist);
            if(exist){
                console.log("*****************************************************====================================");

                return done(null,false,"duplicate email");
            }
            console.log("///////////////////////////////////////////////////==========================================");

            console.log(profile);
            done(null,profile)  
        }catch(err){
            console.log(err);

        }
    })
  );
  
 


