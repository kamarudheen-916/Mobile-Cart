

function changeQuantity(productId, count) {

    const cartQuantityInput = document.getElementById('cartQuantity' + productId);
    const cartQuantity = parseInt(cartQuantityInput.value);

    if (Number(count) === 1) {
        // Increase the quantity
        cartQuantityInput.value = cartQuantity + 1;
    } else if (Number(count) === -1) {
        // Decrease the quantity if it's greater than 0
        if (cartQuantity > 1) {
            cartQuantityInput.value = cartQuantity - 1;
        }
       
    }

    
    if(parseInt(cartQuantity) >0){
        
         // Rest of your code
    fetch(`/add-addToCart/${count}?quantity=${cartQuantity}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
        .then((response) => {
            if (response.ok) {
                console.log('-----------/////****', response.ok);
                location.reload();
            } else {
                console.log('add to cart  Error on JavaScript');
            }
        })
        .then((data) => {
            if (data.message) {
               
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
                alert('One Item Successfully Added To The Cart')
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                location.reload()

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