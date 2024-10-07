const $date = document.querySelector('h2>.date');

const dateFn = () => {

  const now = new Date();
  
  const year = now.getFullYear();
  let month = now.getMonth()+1;
  let date = now.getDate();
  let day = now.getDay();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  day = days[day];
  
  month = month<10 ? `0${month}` : month;
  date = date<10 ? `0${date}` : date;
  
  
  let hour = now.getHours()%12;
  let min = now.getMinutes();
  let sec = now.getSeconds();
  
  const ampm = now.getHours()<12 ? 'AM' : 'PM';
  
  hour = hour<10 ? `0${hour}` : hour;
  min = min<10 ? `0${min}` : min;
  sec = sec<10 ? `0${sec}` : sec;
  
  if(hour>0){
    $date.textContent= `${year}. ${month}. ${date}. (${day}) ${hour}:${min}:${sec} ${ampm}`;
  }else{
    $date.textContent= `${year}. ${month}. ${date} (${day}) 12:${min}:${sec} ${ampm}`;
  }
}

dateFn();

const intervalKey = setInterval(dateFn, 1000);





