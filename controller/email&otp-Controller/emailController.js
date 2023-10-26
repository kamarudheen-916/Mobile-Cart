const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const generateOTP = require('./otpController')
require('dotenv').config() 
const userCollection = require('../../model/user/userSchema')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    },
  });

module.exports = function sendMail(req,res,_email){   
    
    // const email = req.session.useremail;
    const email=  _email

    console.log(email);
    const otp = generateOTP()

    const mailOptions ={
        from:process.env.SMTP_MAIL,
        to:email,
        subject:'OTP From Mobile Cart',
        text:`Your OTP is ${otp}`,
    }
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log('Error sendin mail',error);
            res.status(500).send('Error sending email');
        }else{
            console.log('Email Send Successfully');
            res.status(200).send('Email sent successfully'); 
        }
    }) 
    return otp;
}