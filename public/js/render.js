/* global $ */
'use strict';

class Render {

  constructor(store) {
    this.store = store;
  }

  renderPage(store) {
    $('.view').hide();
    $(`#${store.view}`).show();
    console.log(store.view);
  }

  generateRestaurantElement(restaurant) {
    return `
    <li class="js-restaurant-id-element ${restaurant.restaurant_id._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>
    </li>`;
  }

  renderRestaurantList(store) {
    const listOfRestaurants = store.data.wishlist.map((restaurant) => this.generateRestaurantElement(restaurant));
    $('.js-restaurant-list').html(listOfRestaurants.join(''));
  }

  // renderEdit(store) {
  //   const el = $(`#${store.view}`);
  //   const item = store.item;
  //   el.find('[name=name]').val(item.name);
  //   el.find('[name=notes]').val(item.notes);
  // }

  // renderDetail(store) {
  //   const el = $(`#${store.view}`);
  //   const item = store.item;
  //   el.find('.name').text(item.name);
  //   el.find('.notes').text(item.notes);
  // }

  render(store) {
    console.log(store);
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