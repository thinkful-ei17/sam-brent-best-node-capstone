'use strict';

//once the maps api and places library loads
//initMap gets called
function initMap() {
  //where do we want the default city to be?
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 29.651634, lng: -82.324829 },
    zoom: 13
  });

  ////////////////////////////////////////////////////////////
  // Create markers.
  // features.forEach(function (feature) {
  //   const marker = new google.maps.Marker({
  //     position: feature.position,
  //     map: map
  //   });
  // });
  // function addMarker(info) {
  //   console.log(info);
  //   console.log('this is running');
  //   const marker = new google.maps.Marker({
  //     position: info.position,
  //     map: map,
  //     content:[info.content]
  //   });
  //   infowindow.setContent(`<div><strong>${info.content}</strong></div>`);
  //   infowindow.open(map, this);
  // }

  const input = document.getElementById('pac-input');

  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  let marker1 = new google.maps.Marker({
    map: map
  });
 
  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    console.log('place changed triggered');
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

    // Set the position of the marker using the place ID and location.
    const restaurantInfo =
      (`<strong>${place.name}</strong><br><br>
        ${place.formatted_address}<br>
        ${place.formatted_phone_number}<br> 
        <a href=${place.website} target="_blank">Visit restaurants website</a><br><br>
        ${place.opening_hours.weekday_text[0]}<br>
        ${place.opening_hours.weekday_text[1]}<br> 
        ${place.opening_hours.weekday_text[2]}<br>
        ${place.opening_hours.weekday_text[3]}<br>
        ${place.opening_hours.weekday_text[4]}<br>
        ${place.opening_hours.weekday_text[5]}<br>
        ${place.opening_hours.weekday_text[6]}<br><br>
        <button class=js-wishlist-button type="button">Add to wishlist!</button>
        `
      );
    marker1.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker1.setVisible(true);
    infowindow.setContent(restaurantInfo);
    infowindow.open(map, marker1);

  });
}