const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passport = require('passport');
const users = require('../model/user/userSchema');
require('dotenv').config()  


//////////////////////////////////////////////////////////////
passport.use(
    'google-login',
    new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google-login/callback',
      scope: ['profile', 'email'],
    },
    function (accessToken, refreshToken, profile, done) {
            console.log('-------------------------------------profile:',profile);
            done(null,profile)  
    })
  );
  
passport.serializeUser((user,done)=>{
    done(null,user)
});

passport.deserializeUser((user,done)=>{
    done(null,user)
})