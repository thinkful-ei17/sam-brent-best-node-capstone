'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');

const { Restaurant, User } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


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

let server;


function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}


function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };