/* global $ */
'use strict';

class Render {

  constructor(store) {
    this.store = store;
  }

  renderPage(store) {
    $('.view').hide();
    $('#about').hide();
    $(`#${store.view}`).show();
    if (store.about) {
      $('#about').show();
    }
  }

  renderMap(store){
    const place = store.place;

    if (place.geometry.viewport) {
      window.map.fitBounds(place.geometry.viewport);
    } else {
      window.map.setCenter(place.geometry.location);
      window.map.setZoom(17);
    }
    window.marker1.setPlace({
      placeId: place.placeId,
      location: place.geometry.location
    });
    window.marker1.setVisible(true);
    window.infowindow.setContent(window.renderRestaurantInfo(place));
    window.infowindow.open(window.map, window.marker1);
  }

  generateRestaurantElement(restaurant) {
    return `
    <li class="js-restaurant-element" id="${restaurant._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-location">${restaurant.restaurant_id.formatted_address}</div>
      <br>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>
      <button class="js-view-restaurant-button" type="button">View Restaurant Details</button>
    </li>`;
  }

  generateDetailedRestaurantElement(restaurant) {
    const hours = restaurant.restaurant_id.opening_hours;

    return `
    <li class="js-restaurant-element" id="${restaurant._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-basic-details">
      <br>
        ${restaurant.restaurant_id.formatted_address}<br>
        ${restaurant.restaurant_id.formatted_phone_number}<br> 
        <a href="${restaurant.restaurant_id.website}" target="_blank">Visit restaurants website</a><br><br>
        ${hours[0]}<br>
        ${hours[1]}<br> 
        ${hours[2]}<br>
        ${hours[3]}<br>
        ${hours[4]}<br>
        ${hours[5]}<br>
        ${hours[6]}<br><br>
      </div>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>

      <button class="js-update-restaurant-button" type="button">Update Restaurant</button>
      <button class="js-remove-restaurant-button" type="button">Remove Restaurant</button>
      <button class="js-view-wishlist-button" type="button">Return to Wishlist</button>
    </li>`;
  }

  generateEditingRestaurantElement(restaurant) {
    const hours = restaurant.restaurant_id.opening_hours;
    return `
      <li class="js-restaurant-element" id="${restaurant._id}">
        <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
        <div class="restaurant-basic-details">
      <br>
        ${restaurant.restaurant_id.formatted_address}<br>
        ${restaurant.restaurant_id.formatted_phone_number}<br> 
        <a href="${restaurant.restaurant_id.website}" target="_blank">Visit restaurants website</a><br><br>
        ${hours[0]}<br>
        ${hours[1]}<br> 
        ${hours[2]}<br>
        ${hours[3]}<br>
        ${hours[4]}<br>
        ${hours[5]}<br>
        ${hours[6]}<br><br>
      </div>
        
        <label for="notes">Notes:</label>
        <textarea rows="2" cols="50" name="notes" id="notes">${restaurant.notes}</textarea>

        <button class="js-update-restaurant-button" type="button">Update Restaurant</button>
        <button class="js-remove-restaurant-button" type="button">Remove Restaurant</button>
        <button class="js-back-to-restaurant-button" type="button">Cancel</button>
      </li>`;
  }

  renderRestaurantList(store) {
    const listOfRestaurants = store.data.wishlist.map((restaurant) => this.generateRestaurantElement(restaurant));
    $('.js-restaurant-list').html(listOfRestaurants.join(''));
  }

  renderUserDropdown(users){
    return ` <form>
      <label for="user-name">Select user</label>
      <select name="user" id="user-name" size=1 >
        <option value=${users[0]._id}>${users[0].username}</option>
      <option value=${users[1]._id}>${users[1].username}</option>
      <option value=${users[2]._id}>${users[2].username}</option>
    </select>
    </form>`;
  }

  renderEdit(store) {
    const restaurant = this.generateEditingRestaurantElement(store.item);
    $('.js-editing').html(restaurant);
  }

  renderDetail(store) {
    const restaurant = this.generateDetailedRestaurantElement(store.item);
    $('.js-restaurant-detail').html(restaurant);
  }

  render(store) {
    switch (store.view) {
    case 'list': this.renderRestaurantList(store);
      break;
    case 'detail': this.renderDetail(store);
      break;
    case 'edit': this.renderEdit(store);
      break;
    }
    this.renderPage(store);
  }
}