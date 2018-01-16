/* global $ */
'use strict';

class Render {

  constructor(store) {
    this.store = store;
  }

  generateRestaurantElement(restaurant) {
    return `
    <li class="js-restaurant-id-element ${restaurant._id}">
      <div class="restaurant-name">${restaurant.name}</div> 
    </li>`;
  }

  restaurantList() {
    const listOfRestaurants = this.store.data.wishlist.map((restaurant) => this.generateRestaurantElement(restaurant));
    $('.js-restaurant-list').html(listOfRestaurants.join(''));
  }
}