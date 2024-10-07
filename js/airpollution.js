const airPollutionFn = position => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const APIKey = '20bc44bc227c4bdc349880422fe2ba50';

  (async function() {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    const data = await (await fetch(url)).json();
    console.log(data);

    let currentAir = data.list[0].main.aqi;

    //농도 좋을 때 투두 추가
    if(currentAir<4){
      const newRecom = {
        id: state.nextRecomId,
        tit: '환기시키기 좋아요~',
        complete: false
      };
      state.recommends = state.recommends.filter(recom=>recom.tit !== newRecom.tit);
      state = {...state, nextRecomId: state.nextRecomId+1};
      state.recommends.push(newRecom);
      saveStateFn();
    }else{
      //아닐경우 todo 제거
      state.recommends = state.recommends.filter(recom=>recom.tit !== '환기시키기 좋아요~');
      saveStateFn();
      
    }


    //화면에 글자로 출력
    switch(currentAir){
      case 1: currentAir = '매우 좋음'; break;
      case 2: currentAir = '좋음'; break;
      case 3: currentAir = '보통'; break;
      case 4: currentAir = '나쁨'; break;
      case 5: currentAir = '매우 나쁨';
    }

    const $airPollution = document.querySelector('.weather>.current .airPollution');

    $airPollution.textContent = currentAir;


  })();

}
navigator.geolocation.getCurrentPosition(airPollutionFn);
