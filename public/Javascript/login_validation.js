document.addEventListener('DOMContentLoaded', function() {
  const username_err = document.getElementById('username_err');
  const password_err = document.getElementById('password_err');
  const isBlocked_err = document.getElementById('isBlocked_err');
  const google_user_exist = document.getElementById('google_user_exist');

  if (google_user_exist) {
    setTimeout(() => { google_user_exist.style.display = 'none'; }, 5000);
  }

  if (isBlocked_err) {
    setTimeout(() => { isBlocked_err.style.display = 'none'; }, 5000);
  }

  if (password_err && username_err) {
    setTimeout(() => {
      password_err.style.display = 'none';
      username_err.style.display = 'none';
    }, 5000);
  }

  function all_validation() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password1").value;

    const usernameError = document.getElementById("username_error");
    usernameError.textContent = ""; // Clear any previous error messages

    if (username.length < 8) {
      usernameError.textContent = "Username must be at least 8 characters long";
      return false; // Prevent form submission
    }

    const hasUppercaseUsername = /[A-Z]/.test(username);
    const hasLowercaseUsername = /[a-z]/.test(username);

    if (!hasUppercaseUsername || !hasLowercaseUsername) {
      usernameError.textContent = "Username must include both upper and lower case letters";
      return false; // Prevent form submission
    }

    const passwordError = document.getElementById("password_error");
    passwordError.textContent = ""; // Clear any previous error messages

    if (password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters long";
      return false; // Prevent form submission
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    if (!hasUppercase || !hasLowercase) {
      passwordError.textContent = "Password must include both upper and lower case letters";
      return false; // Prevent form submission
    }

    // Allow form submission
    return true;
  }
});


function clearMessage(){
  
  document.querySelector('span').textContent = ''

}