



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

  //----------------------------------------------------------------------------------------
  function openEditAddressModal(addressId) {
    $('#editAddressModal' + addressId).modal('show');
  }

  //----------------------------------------------------------------------------------------

  function loadFile(event) {
    const file = event.target.files[0]; // Get the selected file
    const formData = new FormData();
    formData.append('userProfile', file);
  
    fetch('/post_userProfile_update', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.success){
          document.getElementById('output').src = '/static/profilePhoto/profileCropedPic/'+data.filename;
        }
        // Update the image tag with the uploaded image URL
       
      });
  }
  
  
  //----------------------------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordform');
    
    const  errorResetPasswordMessage= document.querySelector('#errorResetPasswordMessage')
    const resetPasswordSubmitButton = document.querySelector('#resetPassword') 
    const Reset_Password =document.querySelector('#Reset_Password')

   
  
    if(Reset_Password){
    Reset_Password.addEventListener('click',()=>{
      resetPasswordSubmitButton.disabled  =false
    })}

    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        fetch('/get_profile/resetPassword', {
          method: 'POST',
          body: new URLSearchParams(new FormData(resetPasswordForm)), // Serialize the form data
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Set the content type
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
            
              
              resetPasswordSubmitButton.disabled  =true
              

              Swal.fire({
                title: "Good job!",
                text: "Reset Password Successful!",
                icon: "success"
              });
              location.reload()
          
            
            } else {
            
            errorResetPasswordMessage.style.display='block'
            errorResetPasswordMessage.innerHTML=data.message
           
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    }
  });
  
  

  //----------------------------------------------------------------------------------------


function addAddress (){
  const addAddressform = document.querySelector('#addAddressform');
  fetch('post_userAddress',{
    method: 'POST',
          body: new URLSearchParams(new FormData(addAddressform)), // Serialize the form data
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Set the content type
          },
  })
  .then((response)=>response.json())
  .then((data)=>{
    if(data.success){
      location.reload()
      Swal.fire({
        title: "Good job!",
        text: "Add Adress successful!",
        icon: "success"
      });
      
    }
  })
}