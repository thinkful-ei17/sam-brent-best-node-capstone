'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Restaurant, User } = require('../models');
const { userDummyData, restaurantDummyData } = require('../database/dummy-data');

chai.use(chaiHttp);

function seedDatabase(){
  const dummyRestaurant = Restaurant.insertMany(restaurantDummyData);
  const dummyUser = User.insertMany(userDummyData);
  return Promise.all([dummyRestaurant, dummyUser]);
}

function tearDownDatabase(){
  return mongoose.connection.dropDatabase();
}

describe('Restaurant Wishlist API', function(){
  
  before(function(){
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return seedDatabase();
  });

  afterEach(function(){
    return tearDownDatabase();
  });

  after(function(){
    return closeServer();
  });

  describe('GET endpoint', function(){
    
    it('should return all existing users', function(){

      let res;
      return chai.request(app)
        .get('/users')
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.users).to.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          expect(res.body.users).to.have.length.lengthOf(count);
        });
    });

    it('should return a specific user', function(){
      let resUser;
      return chai.request(app)
        .get('/users')
        .then(function(res){
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.users).to.be.a('array');
          expect(res.body.users).to.have.length.of.at.least(1);
          
          res.body.users.forEach(function(user){
            expect(user).to.be.a('object');
            expect(user).to.include.keys('username', 'firstName', 'lastName', 'wishlist');
          });

          resUser = res.body.users[0];
          return User.findById(resUser._id);
        })
        .then(function(user){
          expect(resUser._id).to.contain(user._id);
          expect(resUser.username).to.equal(user.username);
          expect(resUser.firstName).to.equal(user.firstName);
          expect(resUser.lastName).to.equal(user.lastName);
        });
    });

    it('should return a specific restaurant from the wishlist of a user', function(){
      let resUser;
      let resRestaurant;
      return chai.request(app)
        .get('/users')
        .then(function(res){
          expect(res).to.have.status(200);
          expect(res.body.users).to.have.length.of.at.least(1);
          
          resUser = res.body.users[0];
          return User.findById(resUser._id);
        })
        .then(function(user){
          expect(resUser.wishlist).to.have.length.of.at.least(1);
        
          resRestaurant = resUser.wishlist[0];
          return User.findOne(
            { _id: resUser._id }, 
            { 'wishlist': { $elemMatch: { '_id': resRestaurant._id } } } );
        })
        .then(function(restaurant){
          expect(resRestaurant.restaurant_id).to.contain(restaurant.wishlist[0].restaurant_id);
          expect(resRestaurant._id).to.contain(restaurant.wishlist[0]._id);
        });
    });  
  });

});