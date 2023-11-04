const { response } = require("express");

function EditAddress(AddressId){
    fetch(`/editAddress/${AddressId}`,{
    })
    .then((response)=>response.json())
    .then((data)=>{
        if(data){
            alert('edited success')
        }
    })
}