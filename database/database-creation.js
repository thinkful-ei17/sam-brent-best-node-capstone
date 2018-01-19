'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const { User } = require('../models');

mongoose.connect(DATABASE_URL, { useMongoClient: true })
  .then(function () {
    mongoose.connection.db.dropDatabase();

    return User.create([
      {
        username: 'sam', firstName: 'Sam', lastName: 'Gould',
        wishlist: []
      }, {
        username: 'brent', firstName: 'Brent', lastName: 'Guistwite',
        wishlist: []
      },
      {
        username: 'ruggs', firstName: 'Ruggles', lastName: 'Gould',
        wishlist: []
      }
    ]).then(result => console.log(result))
      .catch(err => {
        console.log(err);
      });
  });
