/*
Notes for integration

  Changed images in header
  changed carousel



*/


var navState = 0;
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('main-carousel');
  spaceCarousel();
  window.addEventListener('resize', function(){
    if(!activeSizeSafe()) fixActives();
  });

  window.addEventListener('scroll', function(){
      switchNavBar(scrollY);
    });

});

function switchNavBar(loc) {
  if(navState == 0 && loc > 360){
    document.getElementById('navbar').classList.add('nav-dark')
    navState = 1;
  }
  else if(navState == 1 && loc < 361){
    document.getElementById('navbar').classList.remove('nav-dark')
    navState = 0;
  }
}


function spaceCarousel(){
  var active = document.getElementsByClassName('active');
  var size = 100/active.length;
  for(var i = 0; i < active.length; i++){
    active[i].style.width = size + "%";
  }
}

function fixActives(){
  var active = document.getElementsByClassName('active');
  var total = getActiveWidth() * active.length;
  var max = Math.floor(total / 170);
  var amount = (max < 4) ? 3 : 5;
  var allItems = document.getElementsByClassName('menu-item');
  for(var i = 0; i < allItems.length; i++){
    if(i < amount){
      allItems[i].classList.add('active');
    }else{
      allItems[i].classList.remove('active');
    }
  }
  spaceCarousel();
}

function activeSizeSafe(){
  var w = getActiveWidth();
  return (w > 170 && w < 250) ? true : false;
}

function getActiveWidth(){
  return window.getComputedStyle(document.getElementsByClassName('active')[0]).width.replace("px", "")
}
