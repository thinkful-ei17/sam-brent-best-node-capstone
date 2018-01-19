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
          expect(res.body).to.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          expect(res.body).to.have.length.lengthOf(count);
        });
    });

    it('should return a specific user', function(){
      let resUser;

      return chai.request(app)
        .get('/users')
        .then(function(res){
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);
          
          res.body.forEach(function(user){
            expect(user).to.be.a('object');
            expect(user).to.include.keys('username', 'firstName', 'lastName', 'wishlist');
          });

          resUser = res.body[0];
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
          expect(res.body).to.have.length.of.at.least(1);
          
          resUser = res.body[0];
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

    it('should update a restaurant in the database (portion of UPSERT)', function(){
      const updateRestaurant = {'address_components':[{'long_name':'1206','short_name':'1206','types':['street_number']},{'long_name':'West University Avenue','short_name':'W University Ave','types':['route']},{'long_name':'Fifth Avenue','short_name':'Fifth Avenue','types':['neighborhood','political']},{'long_name':'Gainesville','short_name':'Gainesville','types':['locality','political']},{'long_name':'Alachua County','short_name':'Alachua County','types':['administrative_area_level_2','political']},{'long_name':'Florida','short_name':'FL','types':['administrative_area_level_1','political']},{'long_name':'United States','short_name':'US','types':['country','political']},{'long_name':'32601','short_name':'32601','types':['postal_code']}],'adr_address':'<span class="street-address">1206 W University Ave</span>, <span class="locality">Gainesville</span>, <span class="region">FL</span> <span class="postal-code">32601</span>, <span class="country-name">USA</span>','formatted_address':'1206 W University Ave, Gainesville, FL 32601, USA','formatted_phone_number':'(352) 376-3040','geometry':{'location':{'lat':29.6522551,'lng':-82.33735790000003},'viewport':{'south':29.6508109197085,'west':-82.33870743029149,'north':29.6535088802915,'east':-82.33600946970853}},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','id':'575d4f39b28d51fc3ea5ed14179d1a38b34a8213','international_phone_number':'+1 352-376-3040','name':'McDonald\'s','opening_hours':{'open_now':true,'periods':[{'open':{'day':0,'time':'0000','hours':0,'minutes':0,'nextDate':1516510800000}}],'weekday_text':['Monday: Never','Tuesday: Open 24 hours','Wednesday: Open 24 hours','Thursday: Open 24 hours','Friday: Open 24 hours','Saturday: Open 24 hours','Sunday: Open 24 hours']},'photos':[{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025},{'height':1836,'html_attributions':['<a href="https://maps.google.com/maps/contrib/108440290729341515140/photos">Reinier Cruz</a>'],'width':3264},{'height':2448,'html_attributions':['<a href="https://maps.google.com/maps/contrib/106134198650407433545/photos">Robin Simmons</a>'],'width':3264},{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025},{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025},{'height':3024,'html_attributions':['<a href="https://maps.google.com/maps/contrib/109534396572635176855/photos">Jeanne L</a>'],'width':4032},{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025},{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025},{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025},{'height':768,'html_attributions':['<a href="https://maps.google.com/maps/contrib/104384481723960919338/photos">McDonald&#39;s</a>'],'width':1025}],'place_id':'ChIJL6KGEoSj6IgRu6ygIQ3p2OA','price_level':1,'rating':3.1,'reference':'CmRSAAAA-Afw6kd6KG2WnE2LbB0nlRAEEkUakwfEJcyDx3mmIGwgFqS2uiQGJe3L0H83RHWJDOVjh08PjzuT4CzuPqwhuRDSvXqn5nbV55fcNEy9CrwJmesNSyNcHRTiC-3IfOk3EhCf2Ty_HWf-RmmqERMom7vaGhSwuCa0df0m1z2f1jhudglBuVW_Kg'};
      
      return chai.request(app)
        .put(`/restaurants/${updateRestaurant.placeId}`)
        .send(updateRestaurant)
        .then(function(res) {
          expect(res).to.have.status(201);
        });
    });
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