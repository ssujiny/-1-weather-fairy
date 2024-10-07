const $ddayList = document.querySelector('.dday .list');

const $frmDdayAdd = document.querySelector('.dday>form[name=frmDdayAdd]');
const $frmDdayEdit = document.querySelector('.dday>form[name=frmDdayEdit]');

const $ddayAddTit = $frmDdayAdd.children[1];
const $ddayAddDate = $ddayAddTit.nextElementSibling;

const $ddayEditTit = $frmDdayEdit.children[1];
const $ddayEditDate = $ddayEditTit.nextElementSibling;

const $btnClearDday = document.querySelector('.dday>form .fa-calendar-xmark');

let editDdayId = null;


const reRenderDdayFn = () => {

  while($ddayList.childElementCount>0){
    $ddayList.removeChild($ddayList.firstElementChild);
  }

  for(let i=0; i<state.ddays.length; i++){

    const dday = state.ddays[i];

    const $li = document.createElement('li');
    $li.id = dday.id;

    //삭제아이콘
    const $del_i = document.createElement('i');
    $del_i.classList.add('fa-solid', 'fa-trash-can');
    
    //수정아이콘
    const $edit_i = document.createElement('i');
    $edit_i.classList.add('fa-solid', 'fa-file-pen');
    
    //디데이 계산
    const savedDday = parseInt(dday.date);

    //밀리세컨즈값 변환
    const today = new Date().valueOf();

    const oneDayMill = 24*60*60*1000;
    let remainDay = Math.floor((savedDday-today)/oneDayMill)+1;

    //오늘 이후 날짜일 경우 디데이 표현
    if(remainDay>0){
      const $ddays = document.createElement('h3');
      $ddays.classList.add('ddays');
      const $p = document.createElement('p');
      $ddays.textContent = `D-${remainDay}`;
      $p.textContent = dday.tit;
      $li.append($ddays,$p,$edit_i,$del_i);
      //오늘 날짜 되었을때 사라지게 하기 위한 클래스
      $li.classList.add('timeLimit');
    }else if(remainDay===0){

      //만약 오늘 이전/이후 날짜에 설정한 디데이가 오늘이 되면 제거
      const $lis = document.querySelectorAll('.dday>.list li');

      if($li.classList.contains('timeLimit')){
        $lis.forEach(($li)=>{
          
          $li.remove();
          
        });
      }
      //오늘인 경우 오늘 한 일 표현
      const $h3 = document.createElement('h3');
      const $tit = document.createElement('span');
      $tit.classList.add('tit');
      $h3.append($tit);
      $li.append($h3,$edit_i,$del_i);
      $li.classList.add('after');
      $tit.textContent = `오늘은 [${dday.tit}]한 날 `;
      
    }else{
      //오늘 이전일 경우 시간 경과 표현
      remainDay = Math.abs(remainDay);
      const $h3 = document.createElement('h3');
      const $tit = document.createElement('span');
      $tit.classList.add('tit');
      const $afterDay = document.createElement('span');
      $afterDay.classList.add('afterDay');
      $h3.append($tit, $afterDay);
      $li.append($h3,$edit_i,$del_i);
      $li.classList.add('after');
      $tit.textContent = `[${dday.tit}]한 지 `;
      $afterDay.textContent = `${remainDay}일 째`;
      //오늘 날짜 되었을때 사라지게 하기 위한 클래스
      $li.classList.add('timeLimit');
    }

    $ddayList.appendChild($li);
  }

  //수정아이콘 - 클릭이벤트
  const $editIcons = document.querySelectorAll('.dday>.list>li >.fa-file-pen');
  
  $editIcons.forEach(($editIcon)=>{
    $editIcon.addEventListener('click',(evt)=>{
      $frmDdayEdit.classList.add('on');
      $frmDdayAdd.classList.remove('on');

      editDdayId = parseInt(evt.currentTarget.parentElement.id);

      const idx = state.ddays.findIndex(dday=>dday.id===editDdayId);

      let savedDate = new Date(state.ddays[idx].date);

      let year = savedDate.getFullYear();
      let month = savedDate.getMonth()+1;
      let date = savedDate.getDate();

      month = month<10 ? `0${month}` : month;
      date = date<10 ? `0${date}` : date;

      savedDate = `${year}-${month}-${date}`;

      $ddayEditTit.value = state.ddays[idx].tit;
      $ddayEditDate.value = savedDate;

      $ddayEditTit.focus();
    });
  });

  //삭제아이콘 - 클릭이벤트
  const $delIcons = document.querySelectorAll('.dday>.list>li>.fa-trash-can');
  $delIcons.forEach(($delIcon)=>{
    $delIcon.addEventListener('click', (evt)=>{
      const $li = evt.currentTarget.parentElement;

      $li.classList.add('complete');

      const key = setTimeout(()=>{
        $li.remove();
        
        state.ddays = state.ddays.filter(dday=>dday.id !== parseInt($li.id));
  
        saveStateFn();
        reRenderDdayFn();
      },1000);


    });
  });
}//reRenderDdayFn

reRenderDdayFn();

//dday 수정폼 - submit 이벤트
$frmDdayEdit.addEventListener('submit', (evt)=>{
  evt.preventDefault();
  const tit = $ddayEditTit.value.trim();

  //유효성 검사 
  const inputDate = new Date($ddayEditDate
    .value).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    const oneDayMill = 24*60*60*1000;
    
    const gapDay = (inputDate - today) / oneDayMill;
    console.log(`gapDay = ${gapDay}`);

    if(tit==='' || tit===null){
      alert('수정할 Dday 제목을 입력해주세요~');
      $ddayEditTit.focus();
      return;
    }else if(isNaN(gapDay)){
      alert('날짜를 선택해주세요~');
      $ddayEditDate.focus();
      return;
    }
    
    state.ddays = state.ddays.map(dday=>(dday.id===editDdayId) ? {...dday, tit, date:inputDate.valueOf()} : dday);

    saveStateFn();

    $frmDdayAdd.classList.add('on');
    $frmDdayEdit.classList.remove('on');

    reRenderDdayFn();
  
  });

  //디데이 추가 폼 - submit 이벤트
  $frmDdayAdd.addEventListener('submit', (evt)=>{
    evt.preventDefault();

    const tit = $ddayAddTit.value.trim();
    const inputDate = new Date($ddayAddDate.value).setHours(0,0,0,0);

    const today = new Date().setHours(0,0,0,0);
    const oneDayMill = 24*60*60*1000;
    const gapDay = (inputDate - today) / oneDayMill;

    //유효성 검사
    if(tit === '' || tit === null){
      alert('Dday 목표를 입력해주세요~');
      $ddayAddTit.focus();
      return;
    }else if(isNaN(gapDay)){
      alert('Dday 날짜를 입력해주세요~');
      $ddayAddDate.focus();
      return;
    }

    const newDday = {
      id: state.nextDdayId,
      tit,
      date: inputDate
    };

    state = {...state, nextDdayId: state.nextDdayId+1};
    state.ddays.push(newDday);

    console.log(newDday);
    saveStateFn();
    $ddayAddTit.value = '';
    $ddayAddDate.value = '';

    reRenderDdayFn();
  });

//전체 삭제 아이콘
$btnClearDday.addEventListener('click', ()=>{
  state.ddays = [];
  saveStateFn();
  reRenderDdayFn();
});
