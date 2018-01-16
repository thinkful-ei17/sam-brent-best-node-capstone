// 'use strict';


// const key = 'AIzaSyDZ10goBCSJwuHGlVH3ESSufQeqYBuh1sU';
// const URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ10goBCSJwuHGlVH3ESSufQeqYBuh1sU&callback=initMap';

// // var map;
// // function initMap() {
// //   map = new google.maps.Map(document.getElementById('map'), {
// //     center: { lat: -34.397, lng: 150.644 },
// //     zoom: 12
// //   });
// // }

// function initialize() {
//   // Create a map to show the results, and an info window to
//   // pop up if the user clicks on the place marker.
//   var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);

//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: pyrmont,
//     zoom: 15,
//     scrollwheel: false
//   });
//   var infowindow = new google.maps.InfoWindow();
//   var service = new google.maps.places.PlacesService(map);

//   document.getElementById('submit').addEventListener('click', function () {
//     placeDetailsByPlaceId(service, map, infowindow);
//   });
// }

// function placeDetailsByPlaceId(service, map, infowindow) {
//   // Create and send the request to obtain details for a specific place,
//   // using its Place ID.
//   var request = {
//     placeId: document.getElementById('place-id').value
//   };

//   service.getDetails(request, function (place, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//       // If the request succeeds, draw the place location on the map
//       // as a marker, and register an event to handle a click on the marker.
//       var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location
//       });

//       google.maps.event.addListener(marker, 'click', function () {
//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
//           'Place ID: ' + place.place_id + '<br>' +
//           place.formatted_address + '</div>');
//         infowindow.open(map, this);
//       });

//       map.panTo(place.geometry.location);
//     }
//   });
// }

// // Run the initialize function when the window has finished loading.
// google.maps.event.addDomListener(window, 'load', initialize);