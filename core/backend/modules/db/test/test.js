/**
Copyright © 2015 Luis Sieira Garcia

This file is part of Planète.

    Planète is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Planète is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with along with planète.  If not, see <http://www.gnu.org/licenses/>.  If not, see <http://www.gnu.org/licenses/>
**/
var should = require('chai').should(),
    expect = require('chai').expect,
    request = require('supertest'),
    mongoose = require('mongoose');

var app = require('../app'),
    db = require('..');

var mockUser = {
    username: 'admin',
    password: 'admin'
};

// The highest level describe should be the module name.
// This thing -> \x1b[0m will print the name yellow
describe('\x1b[33mDatabase\x1b[0m', function() {
  before(function (done) {
    var config = require('_').config;
    var dbUri = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.TEST_DB;
    mongoose.connect(dbUri, function() {
      clearDB = require('mocha-mongoose')(dbUri);
      clearDB(function() { mongoose.connection.close(done) });
    });
  });

  after(function(done) {
    db.close(done);
  });

  it('Should expose database models', function(done) {
    db.exposeModels(function() {
      expect(db.user).to.exist;
      done();
    });
  });

  it('Should connect to database server', function(done) {
    db.connect(function(err) {
      expect(err).to.not.exist;
      db.isConnected().should.equal(true);
      done();
    });
  });

  it('Should be able to register a user when there is none', function(done) {
    db.registerRootUser(mockUser, function(err) {
      expect(err).not.to.exist;
      done();
    });
  });

  it('Should be unable to register a user when there are some', function(done) {
    db.registerRootUser(mockUser, function(err) {
      db.registerRootUser(mockUser, function(err) {
        expect(err).to.exist;
        done();
      });
    });
  });

  it('Should disconnect from database server', function(done) {
    db.close(function(err) {
      expect(err).to.not.exist;
      db.isConnected().should.equal(false);
      done();
    });
  });

  it('Should report its status', function(done) {
    request(app)
    .post('/status')
    .expect(200, done);
  });

});
