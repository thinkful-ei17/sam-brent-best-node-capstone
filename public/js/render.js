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
    console.log('LOOK AT ME',restaurant);
    return `
    <li class="js-restaurant-element" id="${restaurant._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>
      <button class="js-view-restaurant-button" type="button">View Restaurant Details</button>
    </li>`;
  }

  // UPDATE WITH ALL DESIRED INFORMATION FOR DETAILED VIEW (HOURS, WEBSITE, ETC.)
  generateDetailedRestaurantElement(restaurant) {
    console.log('HEY -- LOOK AT ME',restaurant);
    return `
    <li class="js-restaurant-element" id="${restaurant._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>
      <button class="js-view-restaurant-button" type="button">View Restaurant Details</button>
    </li>`;
  }

  renderRestaurantList(store) {
    console.log('store',store);
    
    const listOfRestaurants = store.data.wishlist.map((restaurant) => this.generateRestaurantElement(restaurant));
    console.log('list', listOfRestaurants);
    console.log(this);
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

  // renderEdit(store) {
  //   const el = $(`#${store.view}`);
  //   const item = store.item;
  //   el.find('[name=name]').val(item.name);
  //   el.find('[name=notes]').val(item.notes);
  // }

  renderDetail(store) {
    const el = $(`#${store.view}`);
    const restaurant = this.generateDetailedRestaurantElement(store.item);
    $('.js-restaurant-detail').html(restaurant);
  }

  render(store) {
    console.log(store.currentUser);
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