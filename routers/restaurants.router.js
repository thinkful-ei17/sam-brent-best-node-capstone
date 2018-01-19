'use strict';

const express = require('express');

const { Restaurant, User } = require('../models');

const router = express.Router();

// UPSERT a Restaurant

router.put('/:placeId', (req, res) => {
  const {name, place_id, formatted_address, formatted_phone_number, opening_hours} = req.body;

  Restaurant
    .findOneAndUpdate(
      {
        placeId: req.params.placeId
      },
      {
        name,
        placeId: place_id,
        formatted_address,
        formatted_phone_number,
        opening_hours: opening_hours.weekday_text,
        position: {
          lat: req.body.geometry.location.lat,
          lng: req.body.geometry.location.lng
        }
      },
      {
        upsert: true,
        new:true
      })
    .then(restaurant => res.status(201).json(restaurant))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

module.exports = router;