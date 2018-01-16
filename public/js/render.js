/* global $ */
'use strict';

class Render {

  constructor(store) {
    this.store = store;
  }

  generateRestaurantElement(restaurant) {
    if (restaurant.notes){
      return `
    <li class="js-restaurant-id-element ${restaurant.restaurant_id._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>
    </li>`;
    } else {
      return `
      <li class="js-restaurant-id-element ${restaurant.restaurant_id._id}">
        <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
        <div class="restaurant-notes">Notes:</div>
      </li>`;
    }
    
  }

  restaurantList() {
    const listOfRestaurants = this.store.data.wishlist.map((restaurant) => this.generateRestaurantElement(restaurant));
    $('.js-restaurant-list').html(listOfRestaurants.join(''));
  }
}