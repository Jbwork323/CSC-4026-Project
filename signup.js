$(document).ready(function () {
  $("#errormsg").hide();
});

$("#signup").click(function (e) {
  email = $("#email").val();
  password = $("#password").val();
  password2 = $("#confirm-password").val();
  if (
    password == password2 &&
    emailValidation(email) &&
    passwordValidation(password)
  ) {
    window.location.replace("homePage.html");
  } else {
    $("#errormsg").show();
  }
});

// regex from https://www.baeldung.com/java-email-validation-regex
// prevents non email entry and sql injection
function emailValidation(email) {
  const regex = /^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
  if (email.match(regex)) return true;
}

// regex from https://www.geeksforgeeks.org/javascript-program-to-validate-password-using-regular-expressions/
function passwordValidation(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  if (password.match(regex)) return true;
}


