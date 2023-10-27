
function addWishlist(productId) {
  
  const add_wishlist = document.getElementById('add_wishlist')
  const add_wishlist_icon= document.getElementById('add_wishlist_icon')
    // Make an AJAX request to add the product to the wishlist

    fetch('/add-wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })
      .then((response) => {
        if(response.added){
          add_wishlist_icon.classList.add('text-danger')
        }else{
          add_wishlist_icon.classList.remove('text-danger')
        }
        response.json()
      })
      .then((data) => {
        if (data.message) {
          add_wishlist_icon.classList.add('selected');
          // alert('One Item Successfully Added To The Wishlist')
        } else {
          add_wishlist_icon.classList.remove('selected'); 
          // console.log('error on adding to wish list');
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

