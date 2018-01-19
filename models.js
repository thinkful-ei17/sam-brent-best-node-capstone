'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  placeId: String,
  formatted_address: String,
  formatted_phone_number: String,
  opening_hours:[String],
  position:{
    lat:Number,
    lng:Number
  }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  wishlist: [{ 
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' } ,
    notes: String ,
    rating: Number
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = { Restaurant, User };