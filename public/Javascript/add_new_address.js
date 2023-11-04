// function EditAddress(AddressId) {
//     alert('test1');
    
//     // Attach the event listener to the modal using Bootstrap's 'shown.bs.modal' event
//     $('#editModal').on('shown.bs.modal', function () {
//         alert('Modal shown');

//         // Fetch data when the modal is shown
//         fetch(`/editAddress/${AddressId}`, {})
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.success) {
//                     alert('Data received');

//                     // Handle the data received from the server, e.g., populate the modal inputs
//                     document.getElementById('HouseName').value = data.address.HouseName;
//                     document.getElementById('city').value = data.address.city;
//                     document.getElementById('pincode').value = data.address.pincode;
//                     document.getElementById('state').value = data.address.state;
//                     document.getElementById('mobileNumber').value = data.address.mobileNumber;
//                 }
//             });
//     });
// }


function deleteAddress(addressId) {
    if (confirm('Are you sure you want to delete this address?')) {
      fetch(`/deletAddress/${addressId}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
          
            // Reload the page or update the UI as needed
            location.reload();
          } else {
            console.error('Error deleting address:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error deleting address:', error);
        });
    }
  }
  function openEditAddressModal(addressId) {
    $('#editAddressModal' + addressId).modal('show');
  }