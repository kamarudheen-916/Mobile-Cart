function toggleWishlist(productId) {
  // Find the corresponding wishlist icon
  const wishlistIcon = document.querySelector(`[data-product-id="${productId}"]`);

  // Check if the icon element exists
  if (wishlistIcon) {
      // Toggle the text-danger class
      if (wishlistIcon.classList.contains('text-danger')) {
          wishlistIcon.classList.remove('text-danger');
      } else {
          wishlistIcon.classList.add('text-danger');
      }

      // Make an AJAX request to add the product to the wishlist
      fetch('/add-wishlist', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
      })
      .then((response) => response.json())
      .then((data) => {
          if (data.message) {
            console.log('One Item Successfully Added To The Wishlist');
          } else {
              console.log('Error on adding to wishlist');
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }
}


  

  function deleteWishlist(productId) {
   

    
      // Make an AJAX request to add the product to the wishlist
      fetch(`/delete-wishlist/${productId}`, {
    
        method: 'DELETE',
      })
        .then((response) => {
          
          if(response.ok){
            console.log('-----------',response);
            window.location.reload();
          }else{
            console.log('Wish List Deleting Error');
          }
        })
        .catch((error) => {
          console.error('Wish List Deleting  Error:', error);
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////

