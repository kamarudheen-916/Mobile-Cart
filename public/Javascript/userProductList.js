
  // Get references to the select element and product rows
  const categorySelect = document.getElementById('category');
  const productRows = document.querySelectorAll('.productTable tbody tr');

  // Add an event listener to the select element
  categorySelect.addEventListener('change', function () {
    const selectedCategory = categorySelect.value;

    // Loop through product rows to show/hide them based on category
    productRows.forEach((row) => {
      const productCategory = row.querySelector('#products_category').textContent; // Adjust the id based on your table structure
      if (selectedCategory === '' || selectedCategory === productCategory) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });
  });
