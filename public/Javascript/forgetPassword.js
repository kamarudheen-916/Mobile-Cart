function forget_password_validation() {
    const username = document.getElementById("username_signUp").value;
    const password = document.getElementById("password_signUp").value;
    const conformPassword = document.getElementById("ConformPassword_signUp").value;

    // Clear any previous error messages
    document.getElementById("username_error_signUp").textContent = "";
    document.getElementById("password_error_signUp").textContent = "";
    document.getElementById("ConformPassword_error_signUp").textContent = "";

    // Validate the username
    if (username.length <= 8 || username[0] === ' ') {
      document.getElementById("username_error_signUp").textContent = "Username must be more than 8 characters and should not start with a space";
      return false;
    }

    // Validate the password
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z\d]/.test(password)) {
      document.getElementById("password_error_signUp").textContent = "Password must be 8 characters or more, contain uppercase and lowercase letters, a number, and a special character";
      return false;
    }

    // Validate the conform password
    if (conformPassword !== password) {
      document.getElementById("ConformPassword_error_signUp").textContent = "Passwords do not match";
      return false;
    }

    return true; // If all validation passes, allow form submission
  }