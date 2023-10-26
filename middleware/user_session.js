const verifyuser = (req,res,next)=>{
    if(req.session.logedIn){
        next();
    }else{
        res.redirect('/gustuser')
    }
}

/////////////////////////////////////////
const userExist =  (req,res,next)=>{
    if(req.session.logedIn){
        res.redirect('/');
    }else{
        next();
    }
}

module.exports = {
    verifyuser,
    userExist,
}