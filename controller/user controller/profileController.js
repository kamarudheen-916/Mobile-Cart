const userCollection = require('../../model/user/userSchema')
const allProducts=require('../../model/admin/productSchema')
const sendMail =require('../../controller/email&otp-Controller/emailController')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');


//user profile
const user_profile_get= async (req,res)=>{
    try {
        const username = req.session.user
        const userData = await userCollection.findOne({username})
        // console.log('userData_______',userData);
        res.render('user/profile',{title:'User Profile',username,userData})
    } catch (error) {
        res.render('error',{error})
    }
}

const user_address_get = async (req,res)=>{
    try {
        const username = req.session.user
        const userData = await userCollection.findOne({username})
        const allAddress = userData.Address
        // const  editAddress =  req.session.editAddress
        // console.log('Original address--2:---------------------',editAddress);
        res.render('user/address',{title:'User Address',username,allAddress})
    } catch (error) {
        res.render('error',{error}) 
    }
}
const user_address_post = async (req,res)=>{
    try {
        const username = req.session.user
        const newAddress =  req.body
        console.log('-----------------NEWADDRESS',newAddress);
        const newAddressUpdate = await userCollection.findOneAndUpdate({username},
           {$push:{Address:newAddress}} )
           console.log('-----------------newAddressUpdate',newAddressUpdate);
        res.redirect('/get_userAddress')
    } catch (error) {
        res.render('error',{error}) 
    }
}

const user_deleteAddress = async(req,res)=>{
    try {
        const addressId =  req.params.addressId
        const username = req.session.user

        if(!addressId){
            console.log('there is no address id ');
            res.render('error',{error})
        }
        
        const isAddressDeleted = await userCollection.updateOne({username},
            {$pull:{Address:{_id:addressId}}})
            // res.redirect('/get_userAddress')
            res.json({success:true})

        

    } catch (error) {
        console.log('address delete error');
        res.render('error',{error}) 
    }
}
const user_editAddress = async(req,res)=>{
    try {
        let addressId =  req.params.addressId
        addressId = new mongoose.Types.ObjectId(addressId);
        const username = req.session.user

        if(!addressId){
            console.log('there is no address id ');
            res.render('error',{error})
        }
        console.log("edit page ------------------",addressId);
        const UserAddress = await userCollection.findOne({Address:{$elemMatch:{_id:addressId}}})
        UserAddress_Address= UserAddress.Address
        // console.log('---------------------',UserAddress_Address);
            let address ;
         UserAddress_Address.forEach((value)=>{
            // console.log('value._id:',value._id);
            // console.log('addressId:',addressId);
            if(value._id.toString()==addressId.toString()){
             address = value;
            }
         })   
        //  console.log('Original address:---------------------',address);
         req.session.editAddress= address
         res.redirect('/get_userAddress')
        //  res.json({
        //     success:true,
        //     address
        // })
        //  console.log('Original address:---------------------', req.session.editAddress);
         

    } catch (error) {
        console.log('address edit error',error);
        res.render('error',{error}) 
    }
}
 
const user_editAddress_post = async (req,res)=>{
    try {
        const addressId = req.params.id
        const editAddress_data = req.body
        console.log('editAddress_data-------------',editAddress_data);
        console.log('editAddress_data-------------',addressId);
        username = req.session.user;
        console.log('username----------',username);
        const objectIdAddressId = new ObjectId(addressId);

        const editAddress = await userCollection.updateOne(
            {
                username,
                'Address._id': objectIdAddressId
            },
            {
                $set: {
                    'Address.$.HouseName': editAddress_data.HouseName,
                    'Address.$.city': editAddress_data.city,
                    'Address.$.pincode': editAddress_data.pincode,
                    'Address.$.state': editAddress_data.state,
                    'Address.$.mobileNumber': editAddress_data.mobileNumber,
                }
            });

            console.log('edited result -----------------',editAddress);
            res.redirect('/get_userAddress')
    } catch (error) {
        console.log('user_editAddress_post error',error);
        res.render('error',{error}) 
    }
}

module.exports={
    user_profile_get, 
    user_address_get,
    user_address_post,
    user_deleteAddress,
    user_editAddress,
    user_editAddress_post,
}