/* global $ Store Render Api */
'use strict';


const api = new Api('/users');
const store = new Store();
const render = new Render(store);
//Runs when all 3rd party libraries load
function startApp(){
  $(() => {
    createMap((place)=>{
      console.log('[APP]updating store place');
      store.place = place;
    });

    api.searchAll()
      .then(users => {
        console.log('this is the response',users);
        store.users = users;
        store.currentUser = users[0]._id;
        $('.user-dropdown').html(render.renderUserDropdown(store.users));
        return api.searchOne(store.currentUser);
      })
      .then(response => {
        console.log(response);
        store.data = response;
        console.log(store.data);
        store.view = 'list';
        render.render(store);
      }).catch(err => {
        console.error(err);
      });

    $('.user-dropdown').on('change','#user-name',function(){
      store.currentUser = $(this).val();
      api.searchOne(store.currentUser)
        .then(response => {
          console.log(response);
          store.data = response;
          console.log(store.data);
          store.view = 'list';
          render.render(store);
        }).catch(err => {
          console.error(err);
        });

    });
    $('#whole-map').on('click', '.js-wishlist-button', function (event) {
      event.preventDefault();
      console.log(event);
      console.log(this);
      console.log(store.place);
      api.createWishlistEntry(store.currentUser,store.place);

      // api.saveToFavorites(store.place)
      //   .then(${ this}.htmlupdatetext)
    });
//hidden checkbox shows on success?
  });
}

//app.js holds state(glue)
//api and goog receive higher order funcs
