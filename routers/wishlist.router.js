'use strict';

const express = require('express');

const { Restaurant, User } = require('../models');

const router = express.Router();

// Get all Users
router.get('/', (req, res) => {
  User
    .find()
    .then(users => {
      res.json({
        users: users.map(
          user => user.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).text('Internal Server Error');
    });
});

// Get a Specific User
router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => res.json(user.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Get a Specific Restaurant on a Specific User's Wishlist
router.get('/:id/:restaurant_id', (req, res) => {
  User
    .findOne({ _id: req.params.id }, { 'wishlist': { $elemMatch: { 'restaurant_id': req.params.restaurant_id } } })
    .then(restaurant => {
      return res.json(restaurant.wishlist[0]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Add User Account
router.post('/', (req, res) => {
  const requiredFields = ['username', 'firstName', 'lastName'];
  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Required Field Missing. Make sure to include a ${field}.`;
      console.error(message);
      res.status(400).send(message);
    }
  }
  User
    .create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    })
    .then(user => res.status(201).json(user.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// router.put('/:id/:restaurant_id', (req, res) => {
//   User
//     .findOneAndUpdate(
//       { _id: req.params.id }, 
//       { 'restaurant_id': req.params.restaurant_id }, 
//       { $set: { 'wishlist' : {} } }
//     )
//     .then(restaurant => {
//       return res.status(200).json(restaurant);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'Internal Server Error' });
//     });
// });

// Delete User Account
router.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Delete a specific restaurant from a specific user's wishlist
router.delete('/:id/:restaurant_id', (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.params.id }, 
      { $pull: { 'wishlist': { 'restaurant_id': req.params.restaurant_id } } }, 
      { new: true })
    .then(() => {
      return res.status(200).send('Successfully Deleted');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

module.exports = router;