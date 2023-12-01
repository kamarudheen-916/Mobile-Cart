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


function verifyReturnOrder(orderId) {
  fetch(`/fetchconfirmOrderReturnData?orderId=${orderId}`, {})
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const returnOrderRequestModalBody = document.getElementById('returnOrderRequestModalBody');
        data.OrderReturnData.Products.forEach((product) => {
          console.log(product);
          document.getElementById('RetunOderID').value =  orderId
          if(product.Status == 'Requested for return'){
          const productContainer = document.createElement('div');
          productContainer.classList.add('border', 'p-2');

          const productDetails = `
            <div class="d-flex justify-content-between p-3">
              <div class='p-2'><img style='width:50px;' src="/static/uploads/${product.ProductId.image[0]}" alt="image"></div>
              <div><h6>${product.ProductId.name}</h6></div>
              <div>₹ : ${product.ProductId.price}</div>
            </div>
            <div class="bg-warning text-center fw-bold rounded">Return Request..!</div>
          `;
          
          

          productContainer.innerHTML = productDetails ;
          returnOrderRequestModalBody.appendChild(productContainer);
          }
        });
      }
    });
}
