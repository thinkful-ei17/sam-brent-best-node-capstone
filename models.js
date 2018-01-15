'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  wishlist: [
    {name: {type: String, required: true},
      rating: Number }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };