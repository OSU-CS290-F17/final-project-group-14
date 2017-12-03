function login () {
  var username = document.getElementById('username').value.trim();

  if(!username) {
    alert("Enter a username."); //Maybe make a better error message?
  } else {
    var getRequest = new XMLHttpRequest();
    var getURL = "/accountPage/" + username;
    getRequest.open('GET', getURL);

    //add error handleing

    getRequest.send();
  }
}

function signUp() {
  var username = document.getElementById('username').value.trim();
  var address = document.getElementById('address').value.trim();

  if(!username || !address) {
    alert("Enter all fields");
  } else {
    var postRequest = new XMLHttpRequest();
    var getRequest = new XMLHttpRequest();
    var postURL = "/newAccount/addAccount";
    postRequest.open('POST', postURL);

    //this object will be changed to correspond with the database
    var userObj = {
      username: username,
      address: address
    };
    console.log(userObj);
    var requestBody = JSON.stringify(userObj);
    console.log(requestBody);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function(event) {
      if(event.target.status !== 200) {
        alert("Error storing data in database:\n\n\n" + event.target.response);
      } else {
        window.location.href = "/signIn";
      }
    });

    postRequest.send(requestBody);
  }
}

document.addEventListener('DOMContentLoaded', function () {

  var loginButton = document.getElementById('login');
  if(loginButton) {loginButton.addEventListener('click', login); }

  var signUpButton = document.getElementById('sign-up');
  if(signUpButton) { signUpButton.addEventListener('click', signUp) }

  if(!document.querySelector('.home-page')) {document.getElementById('sign-in-header').classList.add('hidden'); } //only displays the sign in button in the header on the home page

});
