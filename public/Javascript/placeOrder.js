// document.addEventListener('DOMContentLoaded',()=>{
//     const placeOrderForm = document.getElementById('placeOrderForm')

//     if(placeOrderForm){
//         placeOrderForm.addEventListener('submit',(e)=>{
//             e.preventDefault();
//             fetch('/confirmOrder',{
//                 method:'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded', 
//                   },
//                   body:new URLSearchParams(new FormData(placeOrderForm))
//             })
//             .then((response)=>response.json())
//             .then((data)=>{
//                 if(data){
//                     console.log(data);
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error:'+ error);
//               });
//         })
//     }
// })


function cancelOrder(ProductId){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cancel The Order ?'
      }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/removeOrder/${ProductId}`,{
                method:'POST',
            
            })
            .then((response)=>response.json())
            .then((data)=>{
                if(data.success){
                    location.reload()
                    
                }else{
                    alert(data.message)
                }
            })
        }
      })
    

}

