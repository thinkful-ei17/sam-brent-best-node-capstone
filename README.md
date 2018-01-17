restaurant review/reccomendation/dream list

CREATE;
create entries of restaurants they want to visit


READ;
look their entries and other users?
sort by city


UPDATE;
edit their entries(enjoyed it, went to it, dishes theyd reccommend )


DELETE;
they can delete entry
they can delete account


possible API's 
google maps
open table

Users should be able to CREATE "dream dining list" containing restaurants
Users should be able to UPDATE list
Users should be able to filter list(add city tag to list and sort by tag)
Users should be able to search for other users lists(READ)
Users should be able to DELETE their own list
Users should be able to add a review of a restaurant on their list
Users should be able to add favorite/reccommended dishes

Users should be able to get directions to restaurant?

Presentation Support:
http://thinkful.slides.com/thinkful/demo-deck

Marker Clustering:
https://developers.google.com/maps/documentation/javascript/marker-clustering

Data were grabbing from Google 

//place.name(string)
//place.formatted_address(string)
//place.formatted_phone_number(string)
//place.opening_hours.weekday_text(array 0-7 mon-sun reads "Monday: 11:00AM-10:00PM")
//place.place_id(string)
//place.price_level(int)
//place.website(string)
//place.url?(string)
//place.geometry.location?(lat,lng)

const props = {
  location:{
    lng:1,
    lat:-2
  },
  map:samsMap,
  info:[
    place.name,
    place.formatted_address,
    place.formatted_phone_number,
    place.opening_hours.weekday_text[what day of the week is it?]**OPTIONAL**
  ]
}

function addMarker(properties object){
  
}



