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
    return tearDownDatabase()
      .then(() => {
        return seedDatabase();
      });
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
        .then(() => {
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

  describe('POST endpoint', function(){
    it('should add a new user', function(){
      
      const newUser = {
        'username': 'chris',
        'firstName': 'Chris',
        'lastName': 'Klanac',
        '__v': 0,
        'wishlist': []
      };

      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function(res){
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('username', 'firstName', 'lastName', 'wishlist');
          expect(res.body._id).to.not.be.null;
          expect(res.body.username).to.equal(newUser.username);
          expect(res.body.firstName).to.equal(newUser.firstName);
          expect(res.body.lastName).to.equal(newUser.lastName);
          return User.findById(res.body._id);
        })
        .then(function(user){
          expect(user.username).to.equal(newUser.username);
          expect(user.firstName).to.equal(newUser.firstName);
          expect(user.lastName).to.equal(newUser.lastName);
        });
    });
  });

  describe('PUT endpoints', function(){
    it('should update a wishlist entry of a user', function(){
      const updateRestaurant = {
        'rating': 5,
        'notes': 'Must go back'
      };
      let user;
      let wishlist_id;

      return User
        .findOne()
        .then(function(_user) {
          user = _user;
          wishlist_id = user.wishlist[0]._id;
          return chai.request(app)
            .put(`/users/${user._id}/wishlist/${wishlist_id}`)
            .send(updateRestaurant);
        })
        .then(function(res){
          expect(res).to.have.status(200);
          return User.findOne(
            { _id: user._id }, 
            { 'wishlist': { $elemMatch: { '_id': wishlist_id } } });
        })
        .then(function(restaurant){
          expect(restaurant.wishlist[0].rating).to.equal(updateRestaurant.rating);
          expect(restaurant.wishlist[0].notes).to.equal(updateRestaurant.notes);
        });
    });

    // it('should update a restaurant in the database (portion of UPSERT)', function(){
      
    //   const updateRestaurant = {
    //     'name': 'Burger King'
    //   };
    //   let user;
    //   return User.findOne()
    //     .then(function(_user){
    //       user=_user;
    //       return Restaurant.findOne();
    //     })
    //     .then(function(restaurant){
    //       console.log(restaurant);
    //       updateRestaurant._id = restaurant._id;
    //       console.log(updateRestaurant._id);
    //       return chai.request(app)
    //         .put(`/users/${user._id}`)
    //         .send(updateRestaurant);
    //     })
    //     .then(function(res) {
    //       expect(res).to.have.status(200);
    //       return Restaurant.findById(updateRestaurant._id);
    //     })
    //     .then(function(restaurant) {
    //       console.log(restaurant);
    //       expect(restaurant.name).to.equal(updateRestaurant.name);
    //     });
    // });
  });

  describe('DELETE endpoints', function(){
    it('should remove a user', function(){
      let user;

      return User
        .findOne()
        .then(function(_user) {
          user = _user;
          return chai.request(app).delete(`/users/${user._id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return User.findById(user._id);
        })
        .then(function(_user) {
          expect(_user).to.be.null;
        });
    });

    it('should remove a restaurant from the wishlist of a user', function(){
      let user;
      let wishlist_id;
      return User
        .findOne()
        .then(function(_user) {
          user = _user;
          wishlist_id = user.wishlist[0]._id;
          return chai.request(app).delete(`/users/${user._id}/wishlist/${wishlist_id}`);
        })
        .then(function(res){
          expect(res).to.have.status(204);
          return User.findOne(
            { _id: user._id }, 
            { 'wishlist': { $elemMatch: { '_id': wishlist_id } } });
        })
        .then(function(res){
          expect(res.wishlist.length).to.equal(0);
        });
    });
  });
});