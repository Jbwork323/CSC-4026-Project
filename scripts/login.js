$(document).ready(function () {
  $("#errormsg").hide();
});

$("#login").click(function (e) {
  email = $("#email").val();
  password = $("#password").val();
  if (emailValidation(email) && passwordValidation(password)) {
    window.location.replace("view/homePage.html");
  } else $("#errormsg").show();
});

function passwordValidation(password) {
  if (password == "pass123") return true;
}

function emailValidation(email) {
  if (email == "j@gmail.com") return true;
}
