const express = require('express')
const { Auth ,LoginCredentials}  = require('two-step-auth')

async function signup(emailId){
    console.log(emailId);
    try {
        const res = await Auth(emailId,'Mobile Cart');
    // console.log(res);
    // console.log(res.mail);
    // console.log(res.OTP);
    // console.log(res.success);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {signup}