/* global $ Store Render Api */
'use strict';


const api = new Api('/users');
const store = new Store();
const render = new Render(store);

$(() => {

  api.searchAll()
    .then(response => {
      let id = response.users[0]._id;
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
});