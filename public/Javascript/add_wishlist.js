
function addWishlist(productId) {
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
          alert('One Item Successfully Added To The Wishlist')
        } else {
          console.log('error on adding to wish list');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  

  function deleteWishlist(productId) {
    //  alert((confirm,'somthing',productId));
     console.log(productId);
    
      // Make an AJAX request to add the product to the wishlist
      fetch(`/delete-wishlist/${productId}`, {
    
        method: 'DELETE',
      })
        .then((response) => {
          console.log(response,"----res");
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

    
    function toggleWishlist(button, productId) {
      // Check if the button has the 'added' class
      const isAdded = button.classList.contains('added');
    
      if (isAdded) {
        // Remove item from the wishlist
        // Perform an AJAX request to delete the item from the wishlist
        fetch(`/delete-wishlist/${productId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              button.classList.remove('added'); // Remove the 'added' class
            } else {
              console.log('Error removing item from wishlist');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } else {
        // Add item to the wishlist
        // Perform an AJAX request to add the item to the wishlist
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
              button.classList.add('added'); // Add the 'added' class
            } else {
              console.log('Error adding item to wishlist');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
    