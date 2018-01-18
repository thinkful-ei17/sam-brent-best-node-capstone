'use strict';



/*place.price_level 
0-free
1-inexpensive
2-moderate
3-expensive
4-very expensive
*/

//FOOD TYPE


///////////////////////////////////////////////////
// const key = 'AIzaSyDZ10goBCSJwuHGlVH3ESSufQeqYBuh1sU';

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
  // const service = new google.maps.places.PlacesService(map);
  // marker1.addListener('click', function () {
  //   infowindow.open(map, marker1);
    // console.log('this is the marker', marker1);
    // service.getDetails({
    //   placeId: marker1.place.placeId
    // // }, function (place, status) {
    // //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    // //     console.log('howdy');
    // //     let marker = new google.maps.Marker({
    // //       map: map,
    // //       position: place.geometry.location
    // //     });
    // //     console.log('thisismarkymark',marker);
    // //   }
    // });
  // });




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
    marker1.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker1.setVisible(true);
    infowindow.setContent(restaurantInfo);
    infowindow.open(map, marker1);

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

    
    
    // console.log(place.geometry.location.lat(),
    //   place.geometry.location.lng());

    ///render funcs data attrs
    //return `<a href="#" data-place-id="${place.place_id}">Click here to insert the place</a>`
    // infowindow.setContent(renderInfoWindowContent(place));

    // infowindowContent.querySelector('#place-name').textContent = place.name; 
    // infowindowContent.querySelector('#place-id').textContent = place.place_id;
    // infowindowContent.querySelector('#place-address').textContent =
    //   place.formatted_address;
    
  });
}