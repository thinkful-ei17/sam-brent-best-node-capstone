'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);


it('should return all existing posts', function () {
 
  let res;
  return chai.request(app)
    .get('/')
    .then(_res => {
      res = _res;
      res.should.have.status(200);
    });
});
