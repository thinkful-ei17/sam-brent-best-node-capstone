'use strict';

const express = require('express');

const { Restaurant, User } = require('../models');

const router = express.Router();

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

router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => res.json(user.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

router.post('/', (req, res) => {
  const requiredFields = [ 'username', 'firstName', 'lastName'];
  for (let i=0; i<requiredFields.length; i++){
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
      res.status(500).json({message: 'Internal Server Error'});
    });
});

module.exports = router;