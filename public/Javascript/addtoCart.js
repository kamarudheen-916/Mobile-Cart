

function changeQuantity(productId, count) {
    
    const cartQuantityInput = document.getElementById('cartQuantity' + productId);
    const cartQuantity = parseInt(cartQuantityInput.value);
   

    if (Number(count) === 1) {
        fetch(`increaseCartQuantity?productId=${productId}`,{})
        .then((res)=>res.json())
        .then((data)=>{
            if(cartQuantity < data.stock){
                cartQuantityInput.value = cartQuantity + 1;
                QuantityChange()
            }else{
                
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    iconColor: 'red',
                    titleColor:'black',
                    showConfirmButton: false,
                    timer: 1500,
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
                        location.reload();
                    },
                });
                Toast.fire({
                    icon: 'error',
                    title: 'Avilable Stock Is Reached..!',
                });
            }
        })
        
    } else if (Number(count) === -1) {
        // Decrease the quantity if it's greater than 0
        if (cartQuantity > 1) {
            cartQuantityInput.value = cartQuantity - 1;
            QuantityChange()
        }
       
    }

    function QuantityChange(){
        if(parseInt(cartQuantity) >0){
        
            // Rest of your code
       fetch(`/add-addToCart/${count}?quantity=${cartQuantity}`, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({ productId }),
       })
           .then((response) => response.json())
           .then((data) => {
               if (data.success) {
                  location.reload()
                   console.log('Item Quatity Successfully Changed');
               } else {
                   console.log('Error on adding to wishlist');
               }
           })
           .catch((error) => {
               console.error('Error:', error);
           });
       }
    }
   
}


function addToCart(productId, count){
      // Rest of your code
   
      
      fetch(`/add-addToCart/${count}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                console.log('------------------log');
                console.log(data.message);
                // alert('One Item Successfully Added To The Cart')
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom',
                    iconColor: 'black',
                    titleColor:'black',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'colored-toast',
                      },
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    },
                    didClose: () => {
                        // Reload the page after the toast is closed
                        location.reload();
                    },
                });
                Toast.fire({
                    icon: 'success',
                    title: 'One Item Successfully Added To The Cart',
                });

            } else {
                console.log('Error on adding to wishlist');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function removeFromCart(productId){

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/removeFromCart/${productId}`,{
                headers:{
                    'Content-Type':'application/json'
                },
        
            })
            .then((response)=>response.json())
            .then((data)=>{
                if(data.success){
                    //alert('Item Removed Successfully')
                   
                    location.reload();

                }
            })
        }
      })


    
}