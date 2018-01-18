/* global $ Store Render Api */
'use strict';


const api = new Api('/users');
const store = new Store();
const render = new Render(store);

$(() => {

  api.searchAll()
    .then(users => {
      console.log('this is the response',users);
      store.users = users;
      let id = users[1]._id;
      return api.searchOne(id);
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
});

