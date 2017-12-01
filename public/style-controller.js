/*
Notes for integration

  Changed images in header
  changed carousel



*/
var carousel = undefined;
var allActive = 5;
var isREADY = false;
document.addEventListener("DOMContentLoaded", function(){
  isREADY = true;
  carousel = document.getElementById('main-carousel');
  spaceCarousel();
  carousel.addEventListener('resize', function(){
    spaceCarousel();
  })
});



function spaceCarousel(){
  var active = document.getElementsByClassName('active');
  var cStyle = window.getComputedStyle(carousel);
  // Sets width to carouselWidth/numElems
  var carW = cStyle.width.substring(0, cStyle.width.length-2)
  console.log(carW);

  var width = carW/active.length;
  console.log(width);
  console.log()
  if(width < 180){
    var max = Math.floor(carW/180);
    console.log("max ", max);
    allActive = max;
    adjustActives(0)
    active = document.getElementsByClassName('active');
    width = carW/active.length;
  }
  for(var i = 0; i < active.length; i++){
    active[i].style.width = width + "px";
  }
}

function adjustActives(start){
  var items = document.getElementsByClassName("menu-item")
  for(var i = start; i < items.length ; i++){
    if( i < allActive){
      items[i].classList.add('active');
    }else{
      items[i].classList.remove('active');
    }
  }
}
