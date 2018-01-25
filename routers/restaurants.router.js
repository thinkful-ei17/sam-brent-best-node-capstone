'use strict';

const express = require('express');

const { Restaurant } = require('../models');

const router = express.Router();

// UPSERT a Restaurant

router.put('/:placeId', (req, res) => {
  const {name, place_id, formatted_address, formatted_phone_number, website, opening_hours, geometry} = req.body;

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
        website,
        opening_hours: opening_hours.weekday_text,
        geometry
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