function addNewCoupon (){

    const addNewCouponForm = document.querySelector('#addNewCoupenForm')
    const startDate = document.getElementById('startDate').value
  const endDate = document.getElementById('endDate').value
  const endDateError = document.getElementById('endDateError')
  if(new Date(endDate)<=new Date(startDate)){
    
    endDateError.innerText =  'End Date Must Be More Than Satart Date.'
    return false
  }else{
    endDateError.innerText = ''
  }

    fetch('/admin/addNewCoupon',{
        method:'post',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:new URLSearchParams(new FormData(addNewCouponForm))
    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        if(data.success){
             
            Swal.fire({
              title: "Good job!",
              text: "Coupon Successfully Added..!",
              icon: "success"
            });  
        }else{
           alert('ther is an error on return data form server')
        }
    })
    .catch((error)=>{
    
        console.log(error);
    })
}

//------------------------------------------------------------------------------


function addNewCouponValidation(){
      
  const MinimumPurchaseAmount_add = document.getElementById('MinimumPurchaseAmount_add').value
  const discountAmount_add = document.getElementById('discountAmount_add').value
  const CouponCode = document.getElementById('CouponCode').value
  const DiscountError =  document.getElementById('DiscountError')
  const CouponCodeError = document.getElementById('CouponCodeError')
  
  if(discountAmount_add>MinimumPurchaseAmount_add){
    
    DiscountError.innerText = 'Discount Amount Must Be Less Than Minimum Purchase Amount'
    return false
  }else{
    DiscountError.innerText = ''
  }
  const CouponCodeRejex = /^[A-Za-z0-9]{2,8}$/ 
  if(!CouponCode.match(CouponCodeRejex)){
    CouponCodeError.innerText = 'Invalid Coupon Format!'
    return false
  } else{
    CouponCodeError.innerText = ''
  }
 


  return true;
}
//------------------------------------------------------------------------------

function editCouponValidation(couponId){
      
  const MinimumPurchaseAmount = document.getElementById(`EditMinimumPurchaseAmount${couponId}`).value
  const discountAmount = document.getElementById(`EditDiscountAmount${couponId}`).value
  const CouponCode = document.getElementById(`editCouponCode${couponId}`).value
  const DiscountError =  document.getElementById(`editDiscountError${couponId}`)
  const CouponCodeError = document.getElementById(`editCouponCodeError${couponId}`)
  
  if(MinimumPurchaseAmount<discountAmount){
    DiscountError.innerText = 'Discount Amount Must Be Less Than Minimum Purchase Amount'
    return false
  }else{
    DiscountError.innerText = ''
  }
  const CouponCodeRejex = /^[A-Za-z0-9]{2,8}$/ 
  if(!CouponCode.match(CouponCodeRejex)){
    CouponCodeError.innerText = 'Invalid Coupon Format!(First letter must not be space)'
    return false
  } else{
    CouponCodeError.innerText = ''
  }
 


  return true;
}

//------------------------------------------------------------------------------

function editCouponSubmit (couponId){

  const editCouponForm = document.getElementById(`editCouponForm${couponId}`)
  const startDate = document.getElementById(`editStartDate${couponId}`).value
  const endDate = document.getElementById(`editEndDate${couponId}`).value
  const endDateError = document.getElementById(`editendDateError${couponId}`)
  if(new Date(endDate)<=new Date(startDate)){
    
    endDateError.innerText =  'End Date Must Be More Than Satart Date.'
    return false
  }else{
    endDateError.innerText = ''
  }
  fetch(`/admin/edit-coupon/${couponId}`,{
    method:'post',
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body:new URLSearchParams(new FormData(editCouponForm))
}).then((res)=>res.json())
.then((data)=>{
    console.log(data);
    if(data.success){
      location.reload()
            
        Swal.fire({
          title: "Good job!",
          text: "Coupon Successfully Edited..",
          icon: "success"
        });
    }else{
       alert('ther is an error on return data form server')
    }
})
.catch((error)=>{

    console.log(error);
})
}
//------------------------------------------------------------------------------
function deleteCoupon(couponId){
  fetch(`/admin/deleteCoupon/${couponId}`,{
    method:'delete'
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.success){
      location.reload()
      Swal.fire({
        title: "Good job!",
        text: "Coupon Deleted Successfully!",
        icon: "success"
      });
    }
  })
}

