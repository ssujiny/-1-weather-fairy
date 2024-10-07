const $todoList = document.querySelector('.todo>.list');

let editTodoId = null;

const $frmTodoAdd = document.querySelector('.todo form[name=frmTodoAdd]');

const $frmTodoEdit = document.querySelector('.todo form[name=frmTodoEdit]');

const $addInput = $frmTodoAdd.children[1];
const $editInput = $frmTodoEdit.children[1];

const $btnClearTodo = document.querySelector('.todo>form .fa-calendar-xmark');

const reRenderTodoFn = () => {
  //li 모두 지우기
  while($todoList.childElementCount>0){
    $todoList.removeChild($todoList.firstElementChild);
  }

  for(let i=0; i<state.todos.length; i++){
    const todo = state.todos[i];
    const $li = document.createElement('li');
    $li.id = todo.id;

    const $h3 = document.createElement('h3');
    $h3.textContent = todo.tit;

    const $chk_i = document.createElement('i');

    if(todo.complete){
      $h3.classList.add('complete');
      $chk_i.classList.add('insert', 'fa-solid', 'fa-circle-check');
    }else{
      $h3.classList.remove('complete');
      $chk_i.classList.add('insert', 'fa-regular', 'fa-circle');
    }

    //수정 아이콘
    const $edit_i = document.createElement('i');
    $edit_i.classList.add('fa-solid', 'fa-file-pen');

    //삭제 아이콘
    const $del_i = document.createElement('i');
    $del_i.classList.add('fa-solid', 'fa-trash-can');

    //li에 붙이기
    $li.append($chk_i, $h3, $edit_i, $del_i);

    $todoList.appendChild($li);

  }//for

  //완료 체크버튼 - 클릭이벤트
  const $chkIcons = document.querySelectorAll('.todo>.list .insert');
  
  $chkIcons.forEach(($chkIcon)=>{
    $chkIcon.addEventListener('click', (evt)=>{
      const editTodoId = parseInt(evt.currentTarget.parentElement.id);
      
      console.log(editTodoId);
      state.todos = state.todos.map(todo=>(editTodoId===todo.id) ? {...todo, complete:!todo.complete} : todo);

      saveStateFn();
      reRenderTodoFn();
    });
  });

  //수정아이콘 - 클릭이벤트
  const $editIcons = document.querySelectorAll('.todo>.list .fa-file-pen');

  $editIcons.forEach(($editIcon)=>{
    $editIcon.addEventListener('click', (evt)=>{
      $frmTodoEdit.classList.add('on');
      $frmTodoAdd.classList.remove('on');

      editTodoId = parseInt(evt.currentTarget.parentElement.id);
     

      const idx = state.todos.findIndex(todo=>todo.id===editTodoId);
      $editInput.value = state.todos[idx].tit;
      $editInput.focus();
    });
  });

  //삭제 아이콘 - 클릭이벤트
  const $delIcons = document.querySelectorAll('.todo>.list .fa-trash-can');
  $delIcons.forEach(($delIcon)=>{
    $delIcon.addEventListener('click', (evt)=>{
      const $li = evt.currentTarget.parentElement;
      
      $li.remove();

      //로컬스토리지 삭제
      state.todos = state.todos.filter(todo => todo.id !== parseInt($li.id));

      saveStateFn();
      reRenderTodoFn();
    });
  });

}//reRenderTodoFn

reRenderTodoFn();

//todo 수정폼 - submit 이벤트
$frmTodoEdit.addEventListener('submit', (evt)=>{
  evt.preventDefault();
  const tit = $editInput.value.trim();

  //유효성검사
  if(tit==='' || tit===null){
    alert('수정할 Todo 제목을 입력해주세요~');
    $editInput.focus();
    return;
  }


  state.todos = state.todos.map(todo=>todo.id===editTodoId ? {...todo, tit} : todo);

  saveStateFn();

  $frmTodoAdd.classList.add('on');
  $frmTodoEdit.classList.remove('on');
  $addInput.focus();

  reRenderTodoFn();
});

//입력 폼 = submit 이벤트
$frmTodoAdd.addEventListener('submit', (evt)=>{
  evt.preventDefault();

  const tit = $addInput.value.trim();

  if(tit==='' || tit===null){
    alert('추가할 Todo 제목을 입력해주세요~');
    $addInput.focus();
    return;
  }

  const newTodo = {
    id: state.nextTodoId,
    tit,
    complete: false
  };

  state.todos.push(newTodo);

  state = {...state, nextTodoId: state.nextTodoId+1};

  saveStateFn();
  reRenderTodoFn();

  $addInput.value = '';
});

//전체 삭제 버튼 - 클릭 이벤트
$btnClearTodo.addEventListener('click', ()=>{
  state.todos = [];
  
  saveStateFn();
  reRenderTodoFn();

});