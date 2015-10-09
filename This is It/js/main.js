$(document).ready(function (){

  // create a LatLng object containing the coordinate for the center of the map
  var latlng = new google.maps.LatLng(42.877742, -97.380979);

  // prepare the map properties
  var options = {
    zoom: 3,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    navigationControl: true,
    mapTypeControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  };

  // initialize the map object
  var map = new google.maps.Map(document.getElementById('google_map'), options);

  //add Event Markers
  var eventMarkers = [];
  $.ajax({
    url:"http://api.meetup.com/events?radius=25.0&order=time&group_urlname=chicagoyoungmen&offset=0&photo-host=public&format=json&page=20&fields=&sig_id=125028852&sig=f392277c2b492128ea2e8d686a3b5647fc648e87",
    type:'GET',
    dataType:'JSONP',
    success: function(response){
 

      for(i=0; i<response.results.length; i++){
        //var pass = checkLatLon(lat,lon,response)
        pass = 1;
        if(pass == 1){
            var name = response.results[i].name;
            var venue_name = response.results[i].venue_name;
            var address1 = response.results[i].venue_address1;
            var event_url = response.results[i].event_url;
            var description = response.results[i].description;
            var lat = response.results[i].venue_lat;
            var lon = response.results[i].venue_lon;

        if(response.results[i].name.indexOf("Group") > -1){
          var image = 'img/group.png';
        }
        else if(response.results[i].name.indexOf("Social") > -1){
          var image = 'img/social.png';
        }
        else if(response.results[i].name.indexOf("Service") > -1){
          var image = 'img/service.png';
        }
        else {
          var image = 'img/other.png';
        }

        eventMarkers[i] = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lon),
          map: map,
          icon: image

      })

      //add event info window

            var message = '<div id="content"><h1 id="firstHeading">'+name+'</h1>'+
              '<div id="siteNotice"></div><div id="bodyContent"><p>'+venue_name+'<br>'+
              '<a href="http://maps.apple.com/?q='+lat+','+lon+'">'+address1+'</a><br>'+
              '<a href="'+event_url+'" target="_blank">More Info</a></br></p>'+
              '</div></div>'
        addInfoWindow(eventMarkers[i], message);
    }
  }
    var markerCluster = new MarkerClusterer(map, eventMarkers);
  }
  });
  

  function addInfoWindow(marker, message) {

    var infoWindow = new google.maps.InfoWindow({
      content: message,
    });

    google.maps.event.addListener(marker, 'click', function () {
      map.setCenter(marker.getPosition());
    infoWindow.open(map, marker);
  });
  }

//TODO figure out algorithm for eliminating multiple markers on top of each other
  function checkLatLon(prevLat, prevLon, response){
    var oneHunFt = 22.86/3600;
    currLat = response.results[i].venue_lat;
    currLon = response.results[i].venue_lon;
    if(((prevLat >= currLat + oneHunFt) || (prevLat <= currLat - oneHunFt)) || ((prevLon >= currLon + oneHunFt) || (prevLon <= currLon - oneHunFt))){
      return 0;
    }
    else {
      return 1;
    }
  }
});