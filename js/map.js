const $myTownMap = document.querySelector('.map>.mapContainer>.myTownMap');
const $frmSearch = document.querySelector('.map form[name=search]');
const $search = document.getElementById('search');

const mapRenderFn = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  //console.log(lat, lon);

  let markers = [];

  const options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(lat, lon), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
  };
  //지도 생성
  const map = new kakao.maps.Map($myTownMap, options);

  //장소 검색 객체 생성
  const searchFor = new kakao.maps.services.Places();
  
  //검색결과목록/마커클릭시 장소명 표출할 인포윈도우 생성
  const infoWindow = new kakao.maps.InfoWindow({zIndex:1});


  //장소검색완료시 호출되는 콜백함수(pagination 제외)
  const placesSearchCB = (data, status) => {
    if(status === kakao.maps.services.Status.OK){//정상검색완료
      //검색목록과 마커 표시
      displayPlaces(data);

    }else if(status === kakao.maps.services.Status.ZERO_RESULT){
      alert('검색 결과가 존재하지 않습니다.');
      return;
    }else if(status === kakao.maps.services.Status.ERROR){
      alert('검색 결과 중 오류가 발생했습니다.');
      return;
    }
  }

  //키워드 검색 요청 함수
  const searchPlaces = () => {
    
    const searchWord = $search.value.trim();
    const op = {
      location: options.center,//내 위치 위도경도 값
      radius: 3000,//주위 반경
      sort: kakao.maps.services.SortBy.DISTANCE 
    };

    //검색어 유효성 검사
    if(searchWord === '' || searchWord === null){
      alert('검색어를 입력해주세요!');
      $search.focus();
      return false;
    };

    //장소 검색객체 통해서 검색어로 장소검색 요청
    searchFor.keywordSearch(searchWord, placesSearchCB, op);
  }

  //키워드 클릭시 검색창 자동입력
  const $keywords = document.querySelectorAll('.keyword>li');
  const $btnSearch = $search.nextElementSibling;

  $keywords.forEach(($keyword, idx)=>{
    $keyword.addEventListener('click', ()=>{
      switch(idx){
        case 0 : $search.value = '편의점'; break;
        case 1 : $search.value = '음식점'; break;
        case 2 : $search.value = '카페'; break;
        case 3 : $search.value = '빨래방'; break;
        case 4 : $search.value = '미용실'; break;
        case 5 : $search.value = '은행'; break;
        case 6 : $search.value = '마트';
      }

      //검색어 입력후 0.3초 뒤에 검색 실행
      const key =setTimeout(()=>{
        $btnSearch.click();
      }, 300);
    });
  });

  //폼 submit이벤트 발생시 함수 호출 
  $frmSearch.addEventListener('submit', ()=>{
    searchPlaces();
  });

  //지도위에 표시되고 있는 마커 모두 제거
  function removeMarker(){
    for(let i=0; i<markers.length; i++){
      markers[i].setMap(null);
    }
    markers = [];
  }

  //검색결과 목록과 마커 표시 함수
  function displayPlaces(places){
    const $placeList = document.querySelector('.map .placeList');
    const $menuWrap = document.querySelector('.map #menu_wrap');
    //.createDocumentFragment() : 비어있는 객체 먼저 생성 후 동적인 돔 생성
    const fragment = document.createDocumentFragment();
    const bounds = new kakao.maps.LatLngBounds();
   
    //검색결과 목록에 추가된 항목 제거
    removeAllChildNodes($placeList);

    //지도에 표시된 마커 제거
    removeMarker();

    for(let i=0; i<places.length; i++){
      //마커 생성 및 지도에 표시
      const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
      const marker = addMarker(placePosition, i);
      const itemEI = getListItem(i, places[i]);//검색결과 항목 element 생성

      //검색 장소 위치 기준으로 지도 범위 재설정 - 좌표 추가
      bounds.extend(placePosition);

      //마커와 검색결과 mouseover -> 인포윈도우 장소명 표시
      (function(marker, title){
        kakao.maps.event.addListener(marker, 'mouseover', function(){
          displayInfoWindow(marker, title);
        });

        kakao.maps.event.addListener(marker, 'mouseout', function(){
          infoWindow.close();
        });

        itemEI.onmouseover = function(){
          displayInfoWindow(marker, title);
        };

        itemEI.onmouseout = function(){
          infoWindow.close();
        };

      })(marker, places[i].place_name);

      fragment.appendChild(itemEI);
    }
    //검색 결과 항목을 목록 element에 추가
    $placeList.appendChild(fragment);
    $menuWrap.scrollTop = 0;

    //검색 장소 위치 기준으로 지도 범위 재설정
    map.setBounds(bounds);

  }//function displayPlaces

  //검색결과 항목 element로 반환하는 함수
  function getListItem(index, places){
    const $li = document.createElement('li');
    let itemStr =  '<span class="markerbg marker_' + (index+1) + '"></span>' +
    '<div class="info">' + '   <h5>' + places.place_name + '</h5>';

    if(places.road_address_name){
      itemStr += '    <span>' + places.road_address_name + '</span>' +'   <span class="jibun gray">' +  places.address_name  + '</span>';
    }else{
      itemStr += '    <span>' +  places.address_name  + '</span>'; 
    }
               
    itemStr += '  <span class="tel">' + places.phone  + '</span>' +
              '</div>';           

    $li.innerHTML = itemStr;
    $li.className = 'item';

    return $li;
  }

  //마커 생성하고 지도위에 마커 표시하는 함수
  function addMarker(position, idx){
    const imgSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imgSize = new kakao.maps.Size(36,37);
    const imgOptions = {
      spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };
    const markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOptions);
    const marker = new kakao.maps.Marker({
      position: position,
      image: markerImg
    });

    marker.setMap(map);
    markers.push(marker);

    return marker;

  }

  

  //검색결과 목록/마커 클릭시 호출되는 함수
  function displayInfoWindow(marker, title){
    const content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  }

  //검색결과 목록의 자식 element 제거
  function removeAllChildNodes($li){
    while($li.hasChildNodes()){
      $li.removeChild($li.firstElementChild);
    }
  }

};

navigator.geolocation.getCurrentPosition(mapRenderFn);