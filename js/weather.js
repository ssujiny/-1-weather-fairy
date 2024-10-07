const currentGeoFn = position => {
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;

	const APIKey = '20bc44bc227c4bdc349880422fe2ba50';

	//현재 날씨 데이터
	(async function() {
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&lang=kr&units=metric`

		const data = await (await fetch(url)).json()

		console.log(data);

		//console.log(data);
		const $city = document.querySelector('.current>h3>.city')
		$city.textContent = data.name

		const $temp = document.querySelector('.current>.currentInfo>p>.temp')
		const $hum = document.querySelector('.current>.currentInfo>p>.hum')
		$temp.textContent = parseInt(data.main.temp).toFixed(0) +'°';
		$hum.textContent = data.main.humidity +'%';

		const $weatehrImg = document.querySelector('.current>img')
		const imgSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

		$weatehrImg.src = imgSrc
		$weatehrImg.alt = data.weather[0].main
		$weatehrImg.title = data.weather[0].description

		//현재 습도에 따른 todo 리스트
		const hum = data.main.humidity;
		if(hum>60){
			const newRecom = {
				id: state.nextRecomId,
				tit: '제습 방법이 필요해요!',
				complete: false
			};
			state.recommends = state.recommends.filter(recom=> newRecom.tit !== recom.tit);

			state = {...state, nextRecomId: state.nextRecomId+1};
			state.recommends.push(newRecom);
			saveStateFn();
			$hum.parentElement.style.borderColor = 'lightcoral';
		}else if(hum<40){
			const newRecom = {
				id: state.nextRecomId,
				tit: '가습 방법이 필요해요!',
				complete: false
			};
			state.recommends = state.recommends.filter(recom=> newRecom.tit !== recom.tit);

			state = {...state, nextRecomId: state.nextRecomId+1};
			state.recommends.push(newRecom);
			saveStateFn();
			$hum.parentElement.style.borderColor = 'lightskyblue';
		}else{
			state.recommends.filter(recom=> recom.tit !== '제습 방법이 필요해요!' || recom.tit !== '가습 방법이 필요해요!');
			saveStateFn();
		}
		
	})();

	const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&lang=kr&units=metric`;

	//5일치 데이터
	(async function() {
		const data = await (await fetch(forecastUrl)).json();

		console.log(data);
		
		let today6am = null;
		let today9am = null;
		let today12pm = null;
		let today3pm = null;
		let today6pm = null;
		let today9pm = null;

		const todayDateMill = new Date().setHours(0, 0, 0, 0);

		for (let forecast of data.list) {
			//예보 하나하나의 날짜 객체 생성
			const forecastDate = new Date(forecast.dt_txt)
			const forecastHour = forecastDate.getHours() //예보 하나하나의 시간
			const forecastMill = forecastDate.setHours(0, 0, 0, 0)

			if (todayDateMill === forecastMill) {
				switch (forecastHour) {
					case 9:
						today9am = forecast
					case 12:
						today12pm = forecast
					case 18:
						today6pm = forecast
					case 21:
						today9pm = forecast
				} //switch
			} //if
		} //for

		let firstCast = null; 
    let secCast = null; 
   
		const currentHour = new Date().getHours()
  
    if(currentHour > 12){
      firstCast = today6pm;
      secCast = today9pm;
    }else{
      firstCast = today9am;
      secCast = today12pm;
    }
	
		//1번째 예보 출력
		const $todayFrstInform = document.querySelector('.today>.weathers>.mini:first-child>.inform')
		const $todayFrstImg = $todayFrstInform.previousElementSibling
		$todayFrstImg.src = `https://openweathermap.org/img/wn/${firstCast.weather[0].icon}@2x.png`
		$todayFrstImg.alt = firstCast.weather[0].main
		$todayFrstImg.title = firstCast.weather[0].description

		$todayFrstInform.children[0].textContent = `${new Date(firstCast.dt_txt).getHours()}시`
		$todayFrstInform.children[1].firstElementChild.textContent = firstCast.main.temp.toFixed(0)
		$todayFrstInform.children[2].firstElementChild.textContent = firstCast.main.humidity

		//2번째 예보 출력
		const $todaySecInform = document.querySelector('.today>.weathers>.mini:last-child>.inform')
		const $todaySecImg = $todaySecInform.previousElementSibling
		$todaySecImg.src = `https://openweathermap.org/img/wn/${secCast.weather[0].icon}@2x.png`
		$todaySecImg.alt = secCast.weather[0].main
		$todaySecImg.title = secCast.weather[0].description

		$todaySecInform.children[0].textContent = `${new Date(secCast.dt_txt).getHours()}시`;
		$todaySecInform.children[1].firstElementChild.textContent = secCast.main.temp.toFixed(0);
		$todaySecInform.children[2].firstElementChild.textContent = secCast.main.humidity;
	})();

	/*************4일간 예보 출력************************/
	(async function() {
		const data = await (await fetch(forecastUrl)).json();

		console.log(data);

		let firstDayCast = null;
		let secDayCast = null;
		let thirdDayCast = null;
		let fourthDayCast = null;

		for (forecast of data.list) {
			const forecastDate = new Date(forecast.dt_txt);
			const forecastHour = forecastDate.getHours();
			const forecastMill = forecastDate.setHours(0, 0, 0, 0);
			const todayMill = new Date().setHours(0, 0, 0, 0);
			const dayMill = 24 * 60 * 60 * 1000;

			if (forecastHour === 12) {
				switch (forecastMill) {
					case todayMill + 1 * dayMill:
						firstDayCast = forecast
					case todayMill + 2 * dayMill:
						secDayCast = forecast
					case todayMill + 3 * dayMill:
						thirdDayCast = forecast
					case todayMill + 4 * dayMill:
						fourthDayCast = forecast
				}
			}
		}

		//1일뒤 예보 출력
		const $firstCastTemp = document.querySelector('.fourDays>.weathers>.slide>.mini:first-child .temp')
		const $firstCastHum = document.querySelector('.fourDays>.weathers>.slide>.mini:first-child .hum')
		const $firstCastImg = document.querySelector('.fourDays>.weathers>.slide>.mini:first-child img')
		const $firstCastDate = $firstCastImg.previousElementSibling

		$firstCastDate.textContent = new Date(firstDayCast.dt_txt).getDate() + '일'
		$firstCastImg.src = `https://openweathermap.org/img/wn/${firstDayCast.weather[0].icon}@2x.png`
		$firstCastImg.alt = firstDayCast.weather[0].main
		$firstCastImg.title = firstDayCast.weather[0].description
		$firstCastTemp.textContent = firstDayCast.main.temp.toFixed(0)
		$firstCastHum.textContent = firstDayCast.main.humidity

		//2일뒤 예보 출력
		const $secCastTemp = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(2) .temp')
		const $secCastHum = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(2) .hum')
		const $secCastImg = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(2) img')
		const $secCastDate = $secCastImg.previousElementSibling

		$secCastDate.textContent = new Date(secDayCast.dt_txt).getDate() + '일'
		$secCastImg.src = `https://openweathermap.org/img/wn/${secDayCast.weather[0].icon}@2x.png`
		$secCastImg.alt = secDayCast.weather[0].main
		$secCastImg.title = secDayCast.weather[0].description
		$secCastTemp.textContent = secDayCast.main.temp.toFixed(0)
		$secCastHum.textContent = secDayCast.main.humidity

		//3일뒤 예보 출력
		const $thirdCastTemp = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(3) .temp')
		const $thirdCastHum = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(3) .hum')
		const $thirdCastImg = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(3) img')
		const $thirdCastDate = $thirdCastImg.previousElementSibling

		$thirdCastDate.textContent = new Date(thirdDayCast.dt_txt).getDate() + '일'
		$thirdCastImg.src = `https://openweathermap.org/img/wn/${thirdDayCast.weather[0].icon}@2x.png`
		$thirdCastImg.alt = thirdDayCast.weather[0].main
		$thirdCastImg.title = thirdDayCast.weather[0].description
		$thirdCastTemp.textContent = thirdDayCast.main.temp.toFixed(0)
		$thirdCastHum.textContent = thirdDayCast.main.humidity

    //4일뒤 예보 출력
    const $fourthCastTemp = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(4) .temp')
		const $fourthCastHum = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(4) .hum')
		const $fourthCastImg = document.querySelector('.fourDays>.weathers>.slide>.mini:nth-child(4) img')
		const $fourthCastDate = $fourthCastImg.previousElementSibling

		$fourthCastDate.textContent = new Date(fourthDayCast.dt_txt).getDate() + '일'
		$fourthCastImg.src = `https://openweathermap.org/img/wn/${fourthDayCast.weather[0].icon}@2x.png`
		$fourthCastImg.alt = fourthDayCast.weather[0].main
		$fourthCastImg.title = fourthDayCast.weather[0].description
		$fourthCastTemp.textContent = fourthDayCast.main.temp.toFixed(0)
		$fourthCastHum.textContent = fourthDayCast.main.humidity
    
	})();

/******************************************* */ 
  //3일치 로컬저장소 저장
  (async function(){
		//5일치 예보 데이터 가져오기
    const data = await (await fetch(forecastUrl)).json();

    //오늘 이전자정시간기준 밀리세컨즈
    const today = new Date().setHours(0,0,0,0);
		//내일 기준 밀리세컨즈
    const tomorrow = today +(24*60*60*1000);
		
		//2일치 예보 모아둘 배열 생성
    const twoDays = [];
		//오늘 비소식 있는 예보 모아둘 배열 생성
		const umbrella = [];
    for(forecast of data.list){
      //아이디번호에 따른 날씨 상태 
      //https://openweathermap.org/weather-conditions
      forecastDate = new Date(forecast.dt_txt).setHours(0,0,0,0);
      forecastId = parseInt(forecast.weather[0].id);
   
      //오늘 눈/비 여부에 따른 우산 알림
      if(today===forecastDate){
        if(200 <= forecastId && forecastId<700){
					umbrella.push(forecast);
        }//if
      }//if

      //오늘, 내일 날짜예보 모아둔 배열 데이터 입력
      if(today===forecastDate || tomorrow===forecastDate){
				twoDays.push(forecast);
      }

    }//for~of

		//우산 todo 생성
		if(umbrella.length !== 0){
			//로컬스토리지에 저장할 비소식 객체 생성
			const newRecom = {
				id: state.nextRecomId,
				tit: '우산 챙기기',
				complete: false
			};
			
			//로컬 스토리지 안에 중복된 비소식tit 제거
			state.recommends = state.recommends.filter(recom=> newRecom.tit !== recom.tit);
			
			//로컬스토리지 저장
			state = {...state, nextRecomId: state.nextRecomId+1};
			state.recommends.push(newRecom);
			saveStateFn();
			
		}else{
			state.recommends = state.recommends.filter(recommend=> recommend.tit !== '비소식 - 우산챙기기');
			saveStateFn();
		}

		const highHum = [];
		//오늘내일 습도에 따른 빨래 추천 알림
		twoDays.forEach(day=>{
			const hum = parseInt(day.main.humidity);

			//60이상의 고습도 
			if(hum>60){highHum.push(day)}
		});

		const $info = document.querySelector('.weather h5');

		if(highHum.length === 0){
			$info.classList.remove('on');
				const newRecom = {
					id: state.nextRecommendId,
					tit: '빨래하기 좋은 날씨',
					complete: false
				};
				state.recommends = state.recommends.filter(todo=> newRecom.tit !== todo.tit);
				state = {...state, nextRecommendId: state.nextRecomendId+1};
				state.recommends.push(newTodo);
		}else{
			$info.classList.add('on');
			state.recommends = state.recommends.filter(recommend=> recommend.tit !== '빨래하기 좋은 날씨');
			saveStateFn();
		}
	
    
  })();
}

navigator.geolocation.getCurrentPosition(currentGeoFn);
