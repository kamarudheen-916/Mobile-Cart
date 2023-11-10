function updateOrderStatus(productId,newStatus){
    fetch(`/updateOrderStatus/${productId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
}