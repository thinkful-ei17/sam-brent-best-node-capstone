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

    const users = User.create([
      {
        username: 'sam', firstName: 'Sam', lastName: 'Gould',
        wishlist: [
          { name: 'Alden and Harlow', rating: 5 },
          { name: 'Fresca', rating: 4 },
          { name: 'Burma Superstar', rating: 5 }
        ]
      },
      {
        username: 'brent', firstName: 'Brent', lastName: 'Guistwite',
        wishlist: [
          { name: 'Fresca',  rating: 5 },
          { name: 'French Luandry' },
          { name: 'Burma Superstar', rating: 5 }
        ]
      },
      {
        username: 'ruggs', firstName: 'Ruggles', lastName: 'Gould',
        wishlist: [
          { name: 'Alden and Harlow' },
          { name: 'Top of the Hub' },
          { name: 'Dig In' }
        ]
      }
    ]);
    return users;
  })
  .then(results => {
    console.log('new', JSON.stringify(results, null, 2));
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