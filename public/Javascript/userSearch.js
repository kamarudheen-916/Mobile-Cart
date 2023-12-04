function searchProducts(event) {
    event.preventDefault();

    const searchTerm = document.getElementById('searchInput').value;

    fetch(`/search?searchInput=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            // Update the DOM with search results
            displaySearchResults(results);
         
        })
        .catch(error => {
            console.log('Error during search:', error);
        });
}

function displaySearchResults(results) {
    
    const searchResultContainer = document.getElementById('searchResult')

     // Clear existing content in the container
     searchResultContainer.innerHTML = '';

     // Iterate through the products and append them to the productListDiv
     results.products.forEach((product) => {
       const productHTML = `
         <div class="row justify-content-center mb-3">
           <div class="col-md-12">
             <div class="card shadow-0 border rounded-3">
               <div class="card-body">
                 <div class="row g-0">
                   <div class="col-xl-3 col-md-4 d-flex justify-content-center">
                     <div class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                       <a href="/productDetails/${product._id}" class="text-decoration-none">
                         <img src="/static/uploads/${product.image[0]}" class="w-50" />
                       </a>
                       <a href="#!">
                         <div class="hover-overlay">
                           <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                         </div>
                       </a>
                     </div>
                   </div>
                   <div class="col-xl-6 col-md-5 col-sm-7">
                     <a href="/productDetails/${product._id}" class="text-decoration-none">
                       <h5 class="text-success">${product.name}</h5>
                     </a>
                     <p class="text mb-4 mb-md-0">${product.description}</p>
                   </div>
                   <div class="col-xl-3 col-md-3 col-sm-5">
                     <div class="d-flex flex-row align-items-center mb-1">
                       <h4 class="mb-1 me-1">₹${product.price}</h4>
                     </div>
                     <h6 class="text-success">Free shipping</h6>
                     <div class="mt-4">
                       ${
                         cartProductIds.has(product._id.toString())
                           ? `<a class="text-light btn btn-secondary" href="/get_cart">Go To Cart</a>`
                           : `<a id="addToCartButton_${product._id}" class="btn btn-success" onclick="addToCart('${product._id}', 1)">Add To Cart</a>`
                       }
                       <button id="add_wishlist" type="button" onclick="toggleWishlist('${product._id}')" class="btn btn-success">
                         <i class="fa fa-heart${
                           wishlist.map((item) => item.Product_id.toString()).includes(product._id.toString())
                             ? ' text-danger'
                             : ''
                         }" id="add_wishlist_icon" data-product-id="${product._id}"></i>
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       `;

       // Append the productHTML to the productListDiv
       searchResultContainer.innerHTML += productHTML;
     });
}
