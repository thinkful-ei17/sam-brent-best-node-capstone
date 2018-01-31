'use strict';

function renderRestaurantInfo(place) {
  const hours = place.opening_hours.weekday_text 
    ? place.opening_hours.weekday_text 
    : place.opening_hours;
  
  return (`<strong>${place.name}</strong><br><br>
        ${place.formatted_address}<br>
        ${place.formatted_phone_number}<br> 
        <a href="${place.website}" target="_blank">Visit restaurants website</a><br><br>
        ${hours[0]}<br>
        ${hours[1]}<br> 
        ${hours[2]}<br>
        ${hours[3]}<br>
        ${hours[4]}<br>
        ${hours[5]}<br>
        ${hours[6]}<br><br>
        <button class="js-wishlist-button" type="button">Add to wishlist!</button>
        `
  );
}

function createMap(updatePlace) {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 29.651634, lng: -82.324829
    },
    zoom: 13
  });
  window.map = map;

  const input = document.getElementById('pac-input');

  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  const infowindow = new google.maps.InfoWindow();
  window.infowindow = infowindow;
  const infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  let marker1 = new google.maps.Marker({
    map: map
  });
  window.marker1 = marker1;

  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    
    updatePlace(place);

    marker1.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker1.setVisible(true);
    infowindow.setContent(renderRestaurantInfo(place));
    infowindow.open(map, marker1);
  });

}


