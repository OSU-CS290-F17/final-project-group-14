function login () {
  var username = document.getElementById('username').value.trim();

  if(!username) {
    alert("Enter a username."); //Maybe make a better error message?
  } else {
	  window.location.href = "/"+username+"/accountPage";
	  /*
    var getRequest = new XMLHttpRequest();
    var getURL = "/accountPage/" + username;
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("demo").innerHTML = this.responseText;
		}
    };
    getRequest.open('GET', getURL);

    //add error handleing

    getRequest.send();
	*/
  }
}

function signUp() {
  var username = document.getElementById('username').value.trim();
  var address = document.getElementById('address').value.trim();

  if(!username || !address) {
    alert("Enter all fields");
  } else {
    var postRequest = new XMLHttpRequest();
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

function changeAmount()
{
  var tfa = document.getElementById('transact-from-acc');
  console.log(tfa.selectedIndex);
  var tt = document.getElementById('transact-type');
  var amount = document.getElementById('transact-amount');
  if(tfa.selectedIndex == 0) {
      alert("Please select an account.");
    }
    else if (tt.selectedIndex == 0) {
      alert("Please select transaction type.");
    }
    else {
        var postRequest = new XMLHttpRequest();
        var postURL = "/"+ getUser() +"/accountChange";
        console.log(postURL);
        postRequest.open('POST', postURL);

        var userObj = {
          account: tfa.options[tfa.selectedIndex].text ,
          transaction: tt.options[tt.selectedIndex].text,
          amount: amount.value
        };
        console.log(userObj);
        var requestBody = JSON.stringify(userObj);
        console.log(requestBody);
        postRequest.setRequestHeader('Content-Type', 'application/json');
        postRequest.addEventListener('load', function (event) {
        if (event.target.status !== 200) {
          alert("Error storing photo in database:\n\n\n" + event.target.response);
        } else {
          window.location.href = "./accountPage";
        }
        });

        postRequest.send(requestBody);
    }
}

function transfer()
{

}

function getUser() {
  var currentURL = window.location.pathname;
  var urlComponents = currentURL.split('/');
  return urlComponents[1];
}

document.addEventListener('DOMContentLoaded', function () {

  var loginButton = document.getElementById('login');
  if(loginButton) {loginButton.addEventListener('click', login); }

  var signUpButton = document.getElementById('sign-up');
  if(signUpButton) { signUpButton.addEventListener('click', signUp) }
  // accountTransfer
  var changeAmountButton = document.getElementById('changeAmount');
  if(changeAmountButton) {changeAmountButton.addEventListener('click', changeAmount)}
  var transferButton = document.getElementById('transfer');
  if(transferButton) {transferButton.addEventListener('click', transfer)};

});
