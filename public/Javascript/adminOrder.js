function updateOrderStatus(productId,newStatus){
    fetch(`/updateOrderStatus/${productId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      }).then((res)=>res.json())
        .then((data)=>{
          if(data.success){
            if(data.orderData.Status){
              const Toast = Swal.mixin({
                toast: true,
                position: "center",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: false,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
                didClose: () => {
                  // Reload the page after the toast is closed
                  location.reload();
              },
              });
              Toast.fire({
                icon: "success",
                title: "Order Status Changed  "
              });
              
            }
            
          }
        })
}


function verifyReturnOrder (orderId){

    fetch(`/confirmOrderReturn/${orderId}`,{

    }).then((res)=>res.json())
      .then((data)=>{
        if(data.success){
          alert('Return request accepted')
          location.reload()
        }
      })
}