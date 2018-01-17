'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL, PORT } = require('../config');
const { Restaurant, User } = require('../models');

mongoose.connect(DATABASE_URL, { useMongoClient: true })
  .then(function () {
    mongoose.connection.db.dropDatabase();

    const restaurants = Restaurant.create([
      { _id: 'ccccccccccccccccccccccc1', name: 'Alden and Harlow' },
      { _id: 'ccccccccccccccccccccccc2', name: 'Fresca' },
      { _id: 'ccccccccccccccccccccccc3', name: 'Burma Superstar' },
      { _id: 'ccccccccccccccccccccccc4', name: 'French Laundry' },
      { _id: 'ccccccccccccccccccccccc5', name: 'Top of the Hub' },
      { _id: 'ccccccccccccccccccccccc6', name: 'Dig In' }
    ]);

    const users = User.create([
      {
        username: 'sam', firstName: 'Sam', lastName: 'Gould',
        wishlist: [{ restaurant_id: 'ccccccccccccccccccccccc1', notes: 'MUST try the brussel sprouts', rating: 5}, { restaurant_id: 'ccccccccccccccccccccccc2' }, { restaurant_id: 'ccccccccccccccccccccccc3', notes: 'Tea Leaf Salad is a MUST', rating: 5}]
      }, {
        username: 'brent', firstName: 'Brent', lastName: 'Guistwite',
        wishlist: [{ restaurant_id: 'ccccccccccccccccccccccc4' }, { restaurant_id: 'ccccccccccccccccccccccc5', notes: 'Best view of Boston' }, { restaurant_id: 'ccccccccccccccccccccccc6', notes: 'Sweet Potatoes were overrated', rating: 4 }]
      },
      {
        username: 'ruggs', firstName: 'Ruggles', lastName: 'Gould',
        wishlist: [ { restaurant_id: 'ccccccccccccccccccccccc2' }, { restaurant_id: 'ccccccccccccccccccccccc4' }, { restaurant_id: 'ccccccccccccccccccccccc5' }]
      }
    ]);

    return Promise.all([restaurants, users]);
  }).then(results => {
    console.log('new', JSON.stringify(results, null, 2));
  }).then(() => {
    return User.find().populate('wishlist.restaurant_id');
  }).then(results => {
    console.log('======', JSON.stringify(results, null, 4));
  }).catch(err => {
    console.log(err);
  });