// js/switchForms.js

document.getElementById("showLogin").addEventListener("click", function () {
    document.getElementById("login").style.display = "block";
    document.getElementById("signup").style.display = "none";
    document.getElementById("userInfo").style.display = "none";
  });
  
  document.getElementById("showSignup").addEventListener("click", function () {
    document.getElementById("signup").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("userInfo").style.display = "none";
  });
  