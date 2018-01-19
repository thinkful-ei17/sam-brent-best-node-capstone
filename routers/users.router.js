'use strict';

const express = require('express');

const { Restaurant, User } = require('../models');

const router = express.Router();

// Get all Users
router.get('/', (req, res) => {
  User
    .find()
    .populate('wishlist.restaurant_id')
    .then(users => {
      res.json(users);
      // res.json({
      //   users: users.map(
      //     user => user.serialize())
      // });
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
    .populate('wishlist.restaurant_id')
    .then(user => res.json(user))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Get a Specific Restaurant on a Specific User's Wishlist
router.get('/:id/wishlist/:wishlist_id', (req, res) => {
  User
    .findOne({ _id: req.params.id }, { 'wishlist': { $elemMatch: { '_id': req.params.wishlist_id } } })
    .populate('wishlist.restaurant_id')
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

// Update a wishlist entry
router.put('/:id/wishlist/:wishlist_id', (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.params.id, 'wishlist._id': req.params.wishlist_id }, 
      { $set: { 
        'wishlist.$.rating': req.body.rating,
        'wishlist.$.notes': req.body.notes
      } },
      {new: true}
    )
    .then(() => {
      return User
        .findOne({ _id: req.params.id }, { 'wishlist': { $elemMatch: { '_id': req.params.wishlist_id } } })
        .populate('wishlist.restaurant_id');
    })
    .then(restaurant => {
      return res.status(200).json(restaurant);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});



//Add restaurant to "wishlist"
router.post('/:user_id/wishlist/:restaurant_id', (req, res) => {
  User
    .findByIdAndUpdate(
      req.params.user_id,
      {
        $push: {
          wishlist: {
            restaurant_id: req.params.restaurant_id,
          }}
      },
      {
        new: true
      }
    ).populate('wishlist.restaurant_id')
    .then(results => res.status(200).json(results))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    });
});



// Delete User Account
router.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Delete a specific restaurant from a specific user's wishlist
router.delete('/:id/wishlist/:wishlist_id', (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.params.id }, 
      { $pull: { 'wishlist': { '_id': req.params.wishlist_id } } }, 
      { new: true })
    .then(() => {
      return res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// router.put('/users/restaurant', (req,res) => {
//   const {name, placeId, formatted_address, formatted_phone_number, opening_hours, notes} = req.body;
//   //Saving google maps restaurant data to database
//   Restaurant
//     .findOneAndUpdate(
//       {
//         placeId
//       },
//       {
//         name,
//         placeId,
//         formatted_address,
//         formatted_phone_number,
//         opening_hours: opening_hours.weekday_text,
//         position: {
//           lat: req.body.geometry.location.lat(),
//           lng: req.body.geometry.location.lng()
//         }
//       },
//       {
//         upsert: true,
//         new:true
//       })
//     .then(results => res.status(200).json(results))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'Something went wrong' });
//     });
// });

module.exports = router;