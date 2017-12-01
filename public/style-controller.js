/*
Notes for integration

  Changed images in header
  changed carousel



*/


var navState = 0;
var currentCarousel = 0;
var carouselElems = [];
document.addEventListener("DOMContentLoaded", function(){
  initCarousel();

  window.addEventListener('resize', function(){
    if(!activeSizeSafe()) fixActives();
  });

  window.addEventListener('scroll', function(){
      switchNavBar(scrollY);
    });

});
function initCarousel(){
  var c = document.getElementById('main-carousel');
  var children = c.childNodes;
  for(var i = 0; i < children.length; i++){
    if(children[i].tagName == 'DIV')
      carouselElems.push(children[i]);
  }
  console.log(carouselElems);

  while (c.hasChildNodes()) {
      c.removeChild(c.lastChild);
  }
  buildIndicators();


}
function buildIndicators(){

  var amount = carouselElems.length;
  var holder = document.getElementById('carousel-indicators');

  for(var i = 0; i < amount; i++){
    carouselElems[i].id = 'item...'+i; //should make all unique
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
  document.getElementById('indicator...'+currentCarousel).classList.remove('selected');
  document.getElementById('indicator...'+id).classList.add('selected');
  currentCarousel = id;
  var center = [parseInt(id)];
  var amount = elementAmount();
  var right = [];
  var left = [];
  for(var i = 0; i < Math.floor(amount / 2); i++){
    right[i] = parseInt(center) + 1 + i;
    left[i] = parseInt(center) - 1 - i;
  }

  var order = left.concat(center.concat(right));
  console.log(order);
  for(var i = 0; i < order.length; i++){
    if(order[i] < 0){
      order[i] = carouselElems.length + order[i]
    }
    if(order > carouselElems.length - 1){
      order[i] = order[i] - carouselElems.length;
    }
  }
  console.log(order);
  //Convert to actual indexes,
  //Make visible in this order

  /*
    Might need to remove from DOM to get correct order
  */
  displayCarouselElems(order);
}
function displayCarouselElems(els){
  var c = document.getElementById('main-carousel');
  w = 100/els.length;
  for(var i = 0; i < els.length; i++){
    var temp = carouselElems[els[i]];
    temp.classList.add('active');
    temp.style.width = w + '%'; 
    document.getElementById('main-carousel').appendChild(temp);
  }
}
function elementAmount(){
  var w = window.getComputedStyle(document.getElementById('main-carousel')).width.replace("px", "");
  console.log(w);

  return Math.floor(w/170);
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
