//네비바 
const $nav = document.querySelector('nav');
const $menus = document.querySelectorAll('nav a');
const $header = document.querySelector('header');
const $todo = document.querySelector('main .todo');
const $dday = document.querySelector('main .dday');
const $map = document.querySelector('.map');
const $main = document.querySelector('main');
const $recipe = $map.nextElementSibling;

const arrTop = [];
let arrTopMobile = [];

//날씨 슬라이드
const $prev = document.querySelector('.weather .fourDays .weathers .prev');
const $next = document.querySelector('.weather .fourDays .weathers .next');
const $slide = $prev.nextElementSibling;

//네비바 즉시실행함수

  let nowIdx = 0;
  let oldIdx = nowIdx;

  
  window.addEventListener('load', ()=>{
    //배열의 단위별 top 값 저장
    arrTop[0] = $header.offsetTop;
    arrTop[1] = $todo.offsetTop;
    arrTop[2] = $dday.offsetTop;
    arrTop[3] = $map.offsetTop;
    arrTop[4] = $recipe.offsetTop;

  });
  

  window.addEventListener('resize', ()=>{
    //배열의 단위별 top 값 저장
    arrTop[0] = $header.offsetTop;
    arrTop[1] = $todo.offsetTop;
    arrTop[2] = $dday.offsetTop;
    arrTop[3] = $map.offsetTop;
    arrTop[4] = $recipe.offsetTop;
  });
 
  //메뉴 아이콘 - 클릭 이벤트
  $menus.forEach(($menu, idx)=>{
    $menu.addEventListener('click', (evt)=>{
      evt.preventDefault();
      
      window.scrollTo({
        top : arrTop[idx]-55,
        behavior : "smooth"
      });
    });
  });

  window.addEventListener('scroll', ()=>{
    const scrollTop = Math.ceil(window.scrollY);

    //스크롤 헤더 높이 나래로 내려가면 네비바 상단 고정
    if(scrollTop>$nav.offsetTop){
      $nav.classList.add('fixed');
    
    }else{
      $nav.classList.remove('fixed');
    }

    for(let i=0; i<$menus.length; i++){
      if(scrollTop>=arrTop[i]-55){
        oldIdx = nowIdx;
        nowIdx = i;

        $menus[oldIdx].parentElement.classList.remove('on');
        $menus[nowIdx].parentElement.classList.add('on');
      }
    }

  });


//날씨 슬라이드 즉시실행함수
(function(){

  let nowIdx = 0;
  
  //이전버튼
  $prev.addEventListener('click', ()=>{
    $next.style.display = 'block';
    
    if(nowIdx>0){
      nowIdx--;
      if(nowIdx===0){$prev.style.display = 'none';}
    }else{
      $prev.style.display = 'none';
      nowIdx = 0;
    }
  
    $slide.style.left = (-150 * nowIdx) + 'px';
  });
  
  //다음 버튼
  $next.addEventListener('click', ()=>{
    $prev.style.display = 'block';
  
    if(nowIdx<2){
      nowIdx++;
      if(nowIdx===2){$next.style.display = 'none';}
    }else{
      $next.style.display = 'none';
      nowIdx = 2;
    }
  
    $slide.style.left = (-150 * nowIdx) + 'px';
  });

})();