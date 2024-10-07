
const tips = [
  
  {tip:'섬유유연제 대신 식초를 사용할 때는 일반 식초가 아니라 화이트 식초를 사용해야 해요.',
    group: '세탁'
  },
  {
    tip:'수건 세탁시에는 섬유유연제를 넣지 않는게 좋아요.',
    group: '세탁'
  },
  {
    tip:'냄비에 물이 끓어 넘치려고 하면 젓가락을 살포시 올려보세요.',
    group: '요리'
  },
  {
    tip:'옷에 피가 묻었을 때는 과산화수소수를 사용해보세요.',
    group: '세탁'
  },
  {
    tip: '욕실 물때 제거에는 치약이 효과적이에요.',
    group: '청소'
  },
  {
    tip:'한달에 1번씩 세탁조 청소를 해주는게 좋아요.',
    group: '세탁'
  },
  {
    tip:'옷에 커피가 묻었을 때는 당분없는 탄산수에 10분정도 담궈보세요.',
    group: '세탁'
  },
  {
    tip:'주방의 기름 찌든 때는 베이킹 소다를 사용해보세요.',
    group: '청소'
  },
  {
    tip:'거울에 린스를 묻히고 잘 닦아내면 깨끗해진 거울을 볼 수 있어요.',
    group: '청소'
  },
  {
    tip: '전자레인지에 물과 식초(5:1)를 섞어서 3분정도 돌리고 닦아보세요.',
    group: '청소'
  }
];

const $hiddenTip = document.querySelector('.hiddenTip');

//랜덤으로 tip 화면 출력
const $tip = document.querySelector('header .tip');
const $tipGroup = document.querySelector('header .tipGroup');

const num = Math.floor(Math.random()*tips.length);

$tip.textContent = tips[num].tip;
$tipGroup.textContent = tips[num].group;

const $ul = document.createElement('ul');
//li 동적 생성
for(let i=0; i<tips.length; i++){
  const $li = document.createElement('li');
  $ul.append($li);
}

$hiddenTip.append($ul);

//tip 모음집에 객체 값 출력
const $liTips = document.querySelectorAll('header .hiddenTip li');
$liTips.forEach(($liTip,idx)=>{
 $liTip.textContent =`[${tips[idx].group}] ${tips[idx].tip} `;
});

//팁 아이콘 - 클릭이벤트
const $btnTip = $tip.previousElementSibling;

$btnTip.addEventListener('click', ()=>{
  $hiddenTip.classList.toggle('show');
});

