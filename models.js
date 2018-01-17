'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  placeId: String,
  address: String
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

userSchema.methods.serialize = function(){
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    wishlist: this.wishlist,
    _id: this._id
  // REMOVE _id FOR DEVELOPMENT ONLY
  };
};

const User = mongoose.model('User', userSchema);

module.exports = { Restaurant, User };