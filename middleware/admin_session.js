const verifyAdmin = (req,res,next)=>{
    if(req.session.adminLoggedin){
        next();
    }else{
        res.redirect('/admin')
    }
}

/////////////////////////////////////////
const adminExist =  (req,res,next)=>{
    if(req.session.adminLoggedin){
        res.redirect('/admin/dashbord')
    }else{
        next();
    }
}

module.exports = {
    verifyAdmin,
    adminExist,
}