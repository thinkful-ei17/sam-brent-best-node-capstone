'use strict';

// let store = {};

//once the maps api and places library loads
//initMap gets called
function initMap() {
  console.log('helloworld');
  //where do we want the default city to be?
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 29.651634, lng: -82.324829
    },
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
    //foreach items hour array append all
    function restaurantInfo(place) {
      store.place = place;
      const hours = place.opening_hours.weekday_text;
      return (`<strong>${place.name}</strong><br><br>
        ${place.formatted_address}<br>
        ${place.formatted_phone_number}<br> 
        <a href=${place.website} target="_blank">Visit restaurants website</a><br><br>
        ${hours[0]}<br>
        ${hours[1]}<br> 
        ${hours[2]}<br>
        ${hours[3]}<br>
        ${hours[4]}<br>
        ${hours[5]}<br>
        ${hours[6]}<br><br>
        <button class=js-wishlist-button type="button">Add to wishlist!</button>
        `
      );
    }
    marker1.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker1.setVisible(true);
    infowindow.setContent(restaurantInfo(place));
    infowindow.open(map, marker1);
    //////////////////////////////

    // let dummyData =
    //   (`${place.name}<br>
    //   ${place.place_id}<br>
    //   ${place.formatted_address}<br>
    //   ${place.formatted_phone_number}<br>
    //   ${place.opening_hours.weekday_text}<br>
    //   ${position:place.geometry.location}<br>
    //   `);

  });

}

$('#whole-map').on('click', '.js-wishlist-button', function (event) {
  event.preventDefault();
  console.log(event);
  console.log(this);
  console.log(store.place);
  // api.saveToFavorites(store.place)
  //   .then(${ this}.htmlupdatetext)
});
//hidden checkbox shows on success?



// const restaurantSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   placeId: String,
//   formatted_address: String,
//   formatted_phone_number: String,
//   opening_hours: [String],
//   position: {
//     lat: Number,
//     lng: Number
//   }

// });