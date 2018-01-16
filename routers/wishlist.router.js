'use strict';

const express = require('express');

const dummyData = require('../database/dummy-data');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('I am running');
	// const query = req.query;
  const list = dummyData;
	res.json(list);

});

module.exports = router;