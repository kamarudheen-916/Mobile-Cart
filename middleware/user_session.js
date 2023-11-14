const customer = require('../model/user/userSchema')
const verifyuser = async(req,res,next)=>{
    if(req.session.logedIn){    
        let username= req.session.user
        let isUserExist =  await customer.findOne({username})
        if(isUserExist.status =='Blocked'){
            req.session.logedIn=false
            res.redirect('/');
        }
        next();
    }else{
        res.redirect('/gustuser')
    }
}

/////////////////////////////////////////
const userExist =  async(req,res,next)=>{
    if(req.session.logedIn){
        let username= req.session.user
        let isUserExist =  await customer.findOne({username})
        if(isUserExist.status =='Blocked'){
            req.session.logedIn=false
            res.redirect('/');
        }
    }else{
        next();
    }
}

module.exports = {
    verifyuser,
    userExist,
}