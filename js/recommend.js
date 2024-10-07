const $recomList = document.querySelector('.recommend>.list');

const reRenderRecomFn = () =>{
  
  while($recomList.childElementCount>0){
    $recomList.removeChild($recomList.firstElementChild);
  }
  
  for(let i=0; i<state.recommends.length;i++){
    const recom = state.recommends[i];

    const $li = document.createElement('li');
    $li.id = recom.id;

    const $h3 = document.createElement('h3');
    $h3.textContent = recom.tit;

    const $chk_i = document.createElement('i');
    if(recom.complete){
      $h3.classList.add('complete');
      $chk_i.classList.add('insert','fa-solid', 'fa-circle-check');
    }else{
      $h3.classList.remove('complete');
      $chk_i.classList.add('insert', 'fa-regular', 'fa-circle');
    }

    const $del_i = document.createElement('i');
    $del_i.classList.add('fa-solid', 'fa-trash-can');

    $li.append($chk_i, $h3, $del_i);

    $recomList.appendChild($li);
  }

  //완료체크아이콘 - 클릭이벤트
  const $chkIcons = document.querySelectorAll('.recommend>.list .insert');

  $chkIcons.forEach(($chkIcon)=>{
    $chkIcon.addEventListener('click', (evt)=>{
      console.log(evt.currentTarget);
 
      const editRecomId = parseInt(evt.currentTarget.parentElement.id);
      console.log(editRecomId);

      state.recommends = state.recommends.map(recom=>(editRecomId===recom.id) ? {...recom, complete:!recom.complete} : recom);

      saveStateFn();
      reRenderRecomFn();

    });
  });

  //삭제 아이콘 - 클릭이벤트
  const $delIcons = document.querySelectorAll('.recommend>.list .fa-trash-can');
  $delIcons.forEach(($delIcon)=>{
    $delIcon.addEventListener('click', (evt)=>{
      const $li = evt.currentTarget.parentElement;
      console.log($li);
      $li.remove();
      
      state.recommends = state.recommends.filter(recom => recom.id !== parseInt($li.id));

      saveStateFn();
      reRenderRecomFn();
    });
  });
}

reRenderRecomFn();