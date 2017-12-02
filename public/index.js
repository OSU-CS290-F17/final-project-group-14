function createPhotoCard(photoURL, caption) {

  var photoCardTemplateArgs = {
    photoURL: photoURL,
    caption: caption
  };

  var photoCardHTML = Handlebars.templates.photoCard(photoCardTemplateArgs);

  return photoCardHTML;

}


function getPersonId() {
  var currentURL = window.location.pathname;
  var urlComponents = currentURL.split('/');
  if (urlComponents[0] === "" && urlComponents[1] === "people") {
    return urlComponents[2];
  } else {
    return null;
  }
}


function handleModalAcceptClick() {

  var photoURL = document.getElementById('photo-url-input').value.trim();
  var caption = document.getElementById('photo-caption-input').value.trim();

  if (!photoURL || !caption) {
    alert("You must fill in all of the fields!");
  } else {

    var postRequest = new XMLHttpRequest();
    var postURL = "/people/" + getPersonId() + "/addPhoto";
    postRequest.open('POST', postURL);

    var photoObj = {
      photoURL: photoURL,
      caption: caption
    };
    var requestBody = JSON.stringify(photoObj);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        alert("Error storing photo in database:\n\n\n" + event.target.response);
      } else {
        var newPhotoCard = createPhotoCard(photoURL, caption);
        var photoCardContainer = document.querySelector('.photo-card-container');

        photoCardContainer.insertAdjacentHTML('beforeend', newPhotoCard);
      }
    });

    postRequest.send(requestBody);

    hideModal();

  }

}


function showModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}


function clearModalInputs() {

  var modalInputElements = document.querySelectorAll('#add-photo-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = '';
  }

}


function hideModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearModalInputs();

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  var addPhotoButton = document.getElementById('add-photo-button');
  addPhotoButton.addEventListener('click', showModal);

  var modalAcceptButton = document.getElementById('modal-accept');
  modalAcceptButton.addEventListener('click', handleModalAcceptClick);

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', hideModal);
  }

});
