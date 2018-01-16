/* global $ Store Render */
'use strict';

const dummyData = [
  {
    'username': 'sam', 'firstName': 'Sam', 'lastName': 'Gould',
    'wishlist': [
      { 'id': 1001, 'name': 'Alden and Harlow', 'rating': 5 },
      { 'id': 1002, 'name': 'Fresca', 'rating': 4 },
      { 'id': 1003, 'name': 'Burma Superstar', 'rating': 5 }
    ]
  },
  {
    'username': 'brent', 'firstName': 'Brent', 'lastName': 'Guistwite',
    'wishlist': [
      { 'id': 1002, 'name': 'Fresca', 'rating': 5 },
      { 'id': 1004, 'name': 'French Luandry' },
      { 'id': 1003, 'name': 'Burma Superstar', 'rating': 5 }
    ]
  },
  {
    'username': 'ruggs', 'firstName': 'Ruggles', 'lastName': 'Gould',
    'wishlist': [
      { 'id': 1001, 'name': 'Alden and Harlow' },
      { 'id': 1005, 'name': 'Top of the Hub' },
      { 'id': 1006, 'name': 'Dig In' }
    ]
  }
];

const store = new Store();
const render = new Render(store);

$(() => {
  store.data = dummyData[0];
  render.restaurantList();
});