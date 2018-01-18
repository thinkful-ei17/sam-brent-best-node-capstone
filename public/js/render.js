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
    <li class="js-restaurant-id-element ${restaurant.restaurant_id._id}">
      <div class="restaurant-name">${restaurant.restaurant_id.name}</div>
      <div class="restaurant-notes">Notes: ${restaurant.notes}</div>
    </li>`;
  }

  renderRestaurantList(store) {
    console.log('store',store);
    
    const listOfRestaurants = store.data.wishlist.map((restaurant) => this.generateRestaurantElement(restaurant));
    console.log('list', listOfRestaurants);
    console.log(this);
    $('.js-restaurant-list').html(listOfRestaurants.join(''));
  }

  
//change to users plz :)
  renderUserDropdown(user){
    return ` <form>
      <label for="user-name">Select user</label>
      <select name="user" id="user-name" size=1 >
        <option selected value=${user[0]._id}>${user[0].username}</option>
      <option value=${user[1]._id}>${user[1].username}</option>
      <option value=${user[2]._id}>${user[2].username}</option>
    </select>
    </form>`;
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
    $('.user-dropdown').html(this.renderUserDropdown(store.users));
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