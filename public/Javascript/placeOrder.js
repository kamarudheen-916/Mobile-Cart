function validateForm() {
    // Add your validation logic here
    // For example, check if a specific address is selected
    var selectedAddress = document.querySelector('input[name="SelectAddress"]:checked');
    var selectedPaymentMethod =  document.querySelector('input[name="paymentMethods"]:checked')
    const placeOrderForm = document.querySelector('placeOrderForm')
    if (!selectedAddress) {
        Swal.fire({
          title: "oops..!",
          text: "Please select an address!",
          icon: "error"
        });
        return false; // Prevent form submission
    }
    if(!selectedPaymentMethod){
     
      Swal.fire({
        title: "oops..!",
        text: "Please select a payment method!",
        icon: "error"
      });
      return false;
    }
  
    // You can add more validation checks as needed

    // If all checks pass, allow the form submission
    return true;
}
//----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

const placeOrderForm = document.getElementById('placeOrderForm');


placeOrderForm.addEventListener('submit', (e) => {
    // Prevent the form from submitting immediately
   
    e.preventDefault();

    // Call your validation function
    if (validateForm()) {
  
        // If validation passes, check the selected payment method
        var selectedPaymentMethod = document.querySelector('input[name="paymentMethods"]:checked');
            // Proceed with the fetch request
            fetch('/confirmOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(new FormData(placeOrderForm)),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response as needed
                  
           
                    if(data.success==='CashOnDelivery'){
                      location.href='/confirmOrderAndGetOrderSucess'
                    }else if(data.success==='OnlinePayment'){
                      
                        razOrPay(data)
                    }else if(data.success ==='WalletAmountExceeded'){
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Wallet Amount Exeeded..!",
                        
                      });
                    }else if(data.success === 'WalletPayment'){
                      location.href = '/confirmOrderAndGetOrderSucess'
                    }else if(data.success ==='Quantity Exeeded'){
                      
                      QuantityErrorSwal(data.QuantityError)

                    }

                })
                .catch(error => console.error('Error:', error));
    }



    function razOrPay(order){ 
      
      var options = {
"key": "rzp_test_0Qv1w8OcPzkkWY", // Enter the Key ID generated from the Dashboard
"amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
"currency": "INR",
"name": "Acme Corp",
"description": "Test Transaction",
"image": "https://example.com/your_logo",
"order_id": order.createdOrder.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
"handler": function (payment){

  $.ajax({
    url:'/verify-payment',
    data:{
      payment,
      order
    },
    method:'post',
    success:(response)=>{
      if(response.success){
        location.href = '/confirmOrderAndGetOrderSucess'
      }else{
        // location.href = '/error'
        
        Swal.fire({
          title: "oops..!",
          text: "Online payment failed ! Choose another payment Option.",
          icon: "error"
        });
      }
    }
  })
    
},
"prefill": {
    "name": "Gaurav Kumar",
    "email": "gaurav.kumar@example.com",
    "contact": "9000090000"
},
"notes": {
    "address": "Razorpay Corporate Office"
},
"theme": {
    "color": "#3399cc"
}
};
var rzp1 = new Razorpay(options);
rzp1.open();
 }});
});


//QuantityErrorSwal
function QuantityErrorSwal(QuantityError){
  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'red',
    titleColor:'black',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: false,
    customClass: {
        popup: 'colored-toast',
      },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    didClose: () => {
        // Reload the page after the toast is closed
        location.href='/get_cart';
    },
});
Toast.fire({
    icon: 'error',
    title: QuantityError,
});
}

// apply Cuopon 
function applyCoupon(){

  const oldTotalDiv = document.getElementById('oldTotalDiv')
  const coupon_amount = document.getElementById('coupon_amount')
  const newTotal = document.getElementById('newTotal')

  
const couponCode = document.getElementById('couponCode').value

fetch(`/applyCoupon/?couponCode=${couponCode}`,{
        method:'post',
        
      })
      .then((res)=>res.json())
      .then((data)=>{
          if(data.success){
            oldTotalDiv.style.display = 'block'
            coupon_amount.innerText  = data.couponAmount
            newTotal.innerText = data.discountAmount
          
            Swal.fire({
              title: "Good job!",
              text: "coupon success!",
              icon: "success"
            });
          }else{
            Swal.fire({
              title: "oops!",
              text: data.message,
              icon: "error"
            });
            // alert(data.message)
          }
      })
}
