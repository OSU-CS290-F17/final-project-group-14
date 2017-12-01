/*
Notes for integration

  Changed images in header
  changed carousel



*/


var navState = 0;
var currentCarousel = 0;
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('main-carousel');
  spaceCarousel();
  buildIndicators();
  window.addEventListener('resize', function(){
    if(!activeSizeSafe()) fixActives();
  });

  window.addEventListener('scroll', function(){
      switchNavBar(scrollY);
    });

});

function buildIndicators(){
  var items = document.getElementsByClassName('menu-item');
  var amount = items.length;
  var holder = document.getElementById('carousel-indicators');

  for(var i = 0; i < amount; i++){
    items[i].id = 'item...'+i; //should make all unique
    var indicator = document.createElement('div');
    indicator.id='indicator...'+ i;
    indicator.dataset.i = i;
    indicator.classList.add('indicator');
    holder.appendChild(indicator);
  }
  holder.addEventListener('click', function(e){
    target = e.target;
    slideTo(target.dataset.i)
  })
  slideTo(currentCarousel);
}

function slideTo(id){
  console.log(currentCarousel)
  console.log(document.getElementById('indicator...'+currentCarousel))
  document.getElementById('indicator...'+currentCarousel).classList.remove('selected');
  console.log(id);
  console.log(document.getElementById('indicator...'+id))
  document.getElementById('indicator...'+id).classList.add('selected');
  currentCarousel = id;
  var center = [parseInt(id)];
  var amount = document.getElementsByClassName('active').length;
  var right = [];
  var left = [];
  for(var i = 0; i < Math.floor(amount / 2); i++){
    right[i] = parseInt(center) + 1 + i;
    left[i] = parseInt(center) - 1 - i;
  }

  var order = left.concat(center.concat(right));
  console.log(order);
  //Convert to actual indexes,
  //Make visible in this order

  /*
    Might need to remove from DOM to get correct order
  */

}
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
  var max = Math.floor(total / 185);

  var amount = (max < 5) ? 3 : 5;
  var range = {
      start : (currentCarousel - Math.floor(amount/2)),
      end : (currentCarousel - Math.floor(amount/2)) + amount
  }
  var allItems = document.getElementsByClassName('menu-item');
  for(var i = 0 ; i < allItems.length; i++){
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
  return (w > 185 && w < 250) ? true : false;
}

function getActiveWidth(){
  return window.getComputedStyle(document.getElementsByClassName('active')[0]).width.replace("px", "")
}
