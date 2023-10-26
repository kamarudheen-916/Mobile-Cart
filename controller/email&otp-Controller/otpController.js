const otpGenerator = require('otp-generator')

module.exports = generateOTP = ()=>{
    const OTP =otpGenerator.generate(4,
         { 
            upperCaseAlphabets: false,
             specialChars: false ,
             lowerCaseAlphabets:false
        });
    return OTP;
}

