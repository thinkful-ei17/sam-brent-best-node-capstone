/* global $ Store Render Api */
'use strict';


const api = new Api('/users');
const store = new Store();
const render = new Render(store);

$(() => {

  api.search()
    .then(response => {
      store.data = response[1];
      console.log(store.data);
      store.view = 'list';
      render.render(store);
    }).catch(err => {
      console.error(err);
    });
});