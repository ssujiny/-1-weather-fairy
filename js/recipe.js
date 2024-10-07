const key = '68ea9fb86f321b3b9c1045069f4ce7d8dbb3b0b3cc28eb08e5ce924216e8f238';

const recipeId = Math.floor(Math.random()*541); //0~100까지의 정수

//돔선택
const $menu = document.querySelector('.recipe .menu');
const $recipeTop = $menu.parentElement;
const $sum = $menu.parentElement.nextElementSibling;
const $level = document.querySelector('.recipe .level');
const $cookingTime = document.querySelector('.recipe .cookingTime');
const $qnt = $cookingTime.parentElement.nextElementSibling;
const $group = $qnt.nextElementSibling;

const $btnReset = $menu.nextElementSibling;

//해당 id 가진 원소만 모을 배열
const pickRecipe = [];

const $ol = document.querySelector('.recipe ol');



//메뉴 정보 출력 함수
(async function(){
  
  //메뉴 정보 가져오기
  const infoUrl = `http://211.237.50.150:7080/openapi/${key}/json/Grid_20150827000000000226_1/1/100`;

  const data = await(await fetch(infoUrl)).json();
  const info = data.Grid_20150827000000000226_1.row;//객체 원소로 한 배열


    $menu.textContent = info[recipeId].RECIPE_NM_KO;
    $sum.textContent = `"${info[recipeId].SUMRY}"`;
    $level.textContent = info[recipeId].LEVEL_NM;
    $cookingTime.textContent = info[recipeId].COOKING_TIME;
    $qnt.textContent = `${info[recipeId].QNT} 기준`;
    $group.textContent = info[recipeId].NATION_NM;

})();


 //요리 순서 출력 함수
 (async function(){
   
   //요리 순서 데이터 가져오기
  const orderUrl = `http://211.237.50.150:7080/openapi/${key}/json/Grid_20150827000000000228_1/1/550`;
  
  
  const data = await(await fetch(orderUrl)).json();

  const infos = data.Grid_20150827000000000228_1.row;//객체를 원소로 가진 배열

  


  infos.forEach(info => {
    if(info.RECIPE_ID===recipeId+1){
      pickRecipe.push(info);
    }
  });


  

  //동적 li생성 + 출력
  for(let i=0; i<pickRecipe.length; i++){
    const $li = document.createElement('li');
    $li.textContent =`${i+1}. ${pickRecipe[i].COOKING_DC}`;
    $ol.append($li);
  };


  
  console.log(data);
})();


$btnReset.addEventListener('click', ()=>{
  
  location.reload();
  window.scrollTo({
    top: $recipeTop.offsetTop
  });

});