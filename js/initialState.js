let state = localStorage.getItem('state');

if(state !== null){
  state = JSON.parse(state);
}else{
  state = {
    recommends: [
      
    ],
    nextRecomId: 1,

    todos: [
  
    ],
    nextTodoId: 1,
    ddays: [
      
    ],
    nextDdayId: 1
  };
  
}

const saveStateFn = () => {
  localStorage.setItem('state', JSON.stringify(state));
}

const $allClear = document.querySelector('header .fa-recycle');

$allClear.addEventListener('click', ()=>{
  if(confirm('입력한 정보가 모두 삭제됩니다. \n동의하시면 확인을 눌러주세요.')){
    localStorage.removeItem('state');
    location.reload();
  }else{
    alert('데이터 초기화가 중지되었습니다.');
  }
  setTimeout(()=>{
    location.reload();
  }, 1000);
});