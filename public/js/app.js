/* global $ Store Render */
'use strict';

// const dummyData = [
//   {
//     'username': 'sam', 'firstName': 'Sam', 'lastName': 'Gould',
//     'wishlist': [
//       { 'id': 1001, 'name': 'Alden and Harlow', 'rating': 5 },
//       { 'id': 1002, 'name': 'Fresca', 'rating': 4 },
//       { 'id': 1003, 'name': 'Burma Superstar', 'rating': 5 }
//     ]
//   },
//   {
//     'username': 'brent', 'firstName': 'Brent', 'lastName': 'Guistwite',
//     'wishlist': [
//       { 'id': 1002, 'name': 'Fresca', 'rating': 5 },
//       { 'id': 1004, 'name': 'French Luandry' },
//       { 'id': 1003, 'name': 'Burma Superstar', 'rating': 5 }
//     ]
//   },
//   {
//     'username': 'ruggs', 'firstName': 'Ruggles', 'lastName': 'Gould',
//     'wishlist': [
//       { 'id': 1001, 'name': 'Alden and Harlow' },
//       { 'id': 1005, 'name': 'Top of the Hub' },
//       { 'id': 1006, 'name': 'Dig In' }
//     ]
//   }
// ];

const dummyData = [
  {
    '_id': '5a5e3e8ab657a306280eaecc',
    'username': 'ruggs',
    'firstName': 'Ruggles',
    'lastName': 'Gould',
    '__v': 0,
    'wishlist': [
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc2',
          'name': 'Fresca',
          '__v': 0
        },
        '_id': '5a5e3e8ab657a306280eaecf'
      },
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc4',
          'name': 'French Laundry',
          '__v': 0
        },
        '_id': '5a5e3e8ab657a306280eaece'
      },
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc5',
          'name': 'Top of the Hub',
          '__v': 0
        },
        '_id': '5a5e3e8ab657a306280eaecd'
      }
    ]
  },
  {
    '_id': '5a5e3e8ab657a306280eaec8',
    'username': 'brent',
    'firstName': 'Brent',
    'lastName': 'Guistwite',
    '__v': 0,
    'wishlist': [
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc4',
          'name': 'French Laundry',
          '__v': 0
        },
        '_id': '5a5e3e8ab657a306280eaecb'
      },
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc5',
          'name': 'Top of the Hub',
          '__v': 0
        },
        'notes': 'Best view of Boston',
        '_id': '5a5e3e8ab657a306280eaeca'
      },
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc6',
          'name': 'Dig In',
          '__v': 0
        },
        'notes': 'Sweet Potatoes were overrated',
        'rating': 4,
        '_id': '5a5e3e8ab657a306280eaec9'
      }
    ]
  },
  {
    '_id': '5a5e3e8ab657a306280eaec4',
    'username': 'sam',
    'firstName': 'Sam',
    'lastName': 'Gould',
    '__v': 0,
    'wishlist': [
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc1',
          'name': 'Alden and Harlow',
          '__v': 0
        },
        'notes': 'MUST try the brussel sprouts',
        'rating': 5,
        '_id': '5a5e3e8ab657a306280eaec7'
      },
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc2',
          'name': 'Fresca',
          '__v': 0
        },
        '_id': '5a5e3e8ab657a306280eaec6'
      },
      {
        'restaurant_id': {
          '_id': 'ccccccccccccccccccccccc3',
          'name': 'Burma Superstar',
          '__v': 0
        },
        'notes': 'Tea Leaf Salad is a MUST',
        'rating': 5,
        '_id': '5a5e3e8ab657a306280eaec5'
      }
    ]
  }
];

const store = new Store();
const render = new Render(store);

$(() => {});

store.data = dummyData[1];
store.view = 'list';
render.render(store);
