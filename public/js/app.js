/* global $ Store Render Api */
'use strict';


const api = new Api('/users');
const store = new Store();
const render = new Render(store);

// startApp is called by index.html line 17 in Google API Script
function startApp() {
  $(() => {
    createMap((place) => {
      store.place = place;
    });

    api.searchAll()
      .then(users => {
        store.users = users;
        store.currentUser = users[0]._id;
        $('.user-dropdown').html(render.renderUserDropdown(store.users));
        return api.searchOne(store.currentUser);
      })
      .then(response => {
        store.data = response;
        store.view = 'list';
        render.render(store);
      }).catch(err => {
        console.error(err);
      });

    $('.user-dropdown').on('change', '#user-name', function () {
      store.currentUser = $(this).val();
      api.searchOne(store.currentUser)
        .then(response => {
          store.data = response;
          store.view = 'list';
          render.render(store);
        }).catch(err => {
          console.error(err);
        });

    });
    
    // EDIT VIEW EVENT LISTENERS

    $('.js-editing').on('click', '.js-back-to-restaurant-button', function (event) {
      event.preventDefault();
      store.view = 'detail';
      render.render(store);
    });

    $('.js-editing').on('click', '.js-remove-restaurant-button', function (event) {
      event.preventDefault();
      const wishlistId = $(this).closest('li').attr('id');
      
      return api.removeWishlistEntry(store.currentUser, wishlistId)
        .then(() => {
          return api.searchOne(store.currentUser);
        })
        .then((response) => {
          store.data = response;
          store.view = 'list';
          render.render(store);
        }).catch(err => {
          console.error(err);
        });
    });

    $('.js-editing').on('click', '.js-update-restaurant-button', function (event) {
      event.preventDefault();
      const updatedNotes = $('textarea#notes').val();
      const wishlistId = store.item._id;
      const entry = {
        rating: null,
        notes: updatedNotes
      };

      api.updateWishlistEntry(store.currentUser, wishlistId, entry)
        .then((response) => {
          store.item = response.wishlist[0];
          store.view = 'detail';
          render.render(store);
        }).catch(err => {
          console.error(err);
        });
    });
    
    // DETAIL VIEW EVENT LISTENERS

    $('.js-restaurant-detail').on('click', '.js-update-restaurant-button', function (event) {
      event.preventDefault();
      store.view = 'edit';
      render.render(store);
    });

    $('.js-restaurant-detail').on('click', '.js-remove-restaurant-button', function (event) {
      event.preventDefault();
      const wishlistId = $(this).closest('li').attr('id');
      return api.removeWishlistEntry(store.currentUser, wishlistId)
        .then(() => {
          return api.searchOne(store.currentUser);
        })
        .then((response) => {
          store.data = response;
          store.view = 'list';
          render.render(store);
        }).catch(err => {
          console.error(err);
        });
    });

    $('.js-restaurant-detail').on('click', '.js-view-wishlist-button', function (event) {
      event.preventDefault();
      api.searchOne(store.currentUser)
        .then((response) => {
          store.data = response;
          store.view = 'list';
          render.render(store);
        }).catch(err => {
          console.error(err);
        });
    });

    // LIST VIEW EVENT LISTENER

    $('.js-restaurant-list').on('click', '.js-view-restaurant-button', function (event) {
      event.preventDefault();
      const wishlistId = $(this).closest('li').attr('id');
      api.details(store.currentUser, wishlistId)
        .then(response => {
          store.item = response;
          store.place = response.restaurant_id;
          store.view = 'detail';
          render.renderMap(store);
          render.render(store);
        }).catch(err => {
          console.error(err);
        });
    });

    // ADD TO WISHLIST EVENT HANDLER

    $('#whole-map').on('click', '.js-wishlist-button', function (event) {
      event.preventDefault();
      api.searchOne(store.currentUser)
        .then(user => {
          for (let i=0; i<user.wishlist.length; i++) {
            if (user.wishlist[i].restaurant_id.placeId === store.place.place_id || store.place.place_id === undefined) {
              $(this).text('Already on Wishlist');
              return Promise.resolve(false);
            }
          } 
          return api.createWishlistEntry(store.currentUser, store.place);
        }).then(response => {
          if (response) {
            $(this).text('ADDED!');
            store.data = response;
            render.render(store);
          }
        }).catch(err => {
          console.error(err);
        });
    });
  });
}