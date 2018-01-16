'use strict';

//POST endpoint

//place.name(string)
//place.formatted_address(string)
//place.formatted_phone_number(string)
//place.opening_hours.weekday_text(array 0-7 mon-sun reads "Monday: 11:00AM-10:00PM")
//place.place_id(string)
//place.price_level(int)
//place.website(string)
//place.url?(string)



///////////////////////////////////////////////////
const key = 'AIzaSyDZ10goBCSJwuHGlVH3ESSufQeqYBuh1sU';

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 29.651634, lng: -82.324829 },
    zoom: 13
  });

  function addMarker(info) {
    console.log(info);
    console.log('this is running');
    var marker = new google.maps.Marker({
      position: info.position,
      map: map,
      content:[info.content]
    });
    infowindow.setContent(`<div><strong>${info.content}</strong></div>`);
    infowindow.open(map, this);
  }

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map
  });
  var service = new google.maps.places.PlacesService(map);
  marker.addListener('click', function () {
    infowindow.open(map, marker);
    console.log('this is the marker', marker);
    service.getDetails({
      placeId: marker.place.placeId
    }, function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        console.log('this is place', place);
        google.maps.event.addListener(marker, 'click', function () {
          console.log(place.geometry.location.lat());
          const info = {
            position:place.geometry.location,
            content:[place.name,place.formatted_address]
          };
          addMarker(info);
         
        });
      }
    });
  });




  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name; 
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });
}