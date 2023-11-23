function validateForm() {
    // Add your validation logic here
    // For example, check if a specific address is selected
    var selectedAddress = document.querySelector('input[name="SelectAddress"]:checked');
    var selectedPaymentMethod =  document.querySelector('input[name="paymentMethods"]:checked')
    const placeOrderForm = document.querySelector('placeOrderForm')
    if (!selectedAddress) {
        alert("Please select an address!");
        return false; // Prevent form submission
    }
    if(!selectedPaymentMethod){
      alert('Please select a payment method')
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
                    console.log(data);
                    if(data.success==='cahsOnDelevery'){
                      location.href='/confirmOrderAndGetOrderSucess'
                    }else if(data.success==='OnliePayment'){
                      
                      razOrPay(data)
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
        alert('payment failuere')
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


// apply Cuopon 
function applyCoupon(){

const couponCode = document.getElementById('couponCode').value
fetch(`/applyCoupon/?couponCode=${couponCode}`,{
        method:'post',
        
      })
      .then((res)=>res.json())
      .then((data)=>{
          if(data.success){
            document.getElementById('AllTotal').innerHTML = data.discountAmount
            alert('coupon success')
          }else{
            alert(data.message)
          }
      })
}
