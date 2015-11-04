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
'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    mongoose = require('mongoose');

chai.use(require('chai-passport-strategy'));

var authentication = require('..');

var mockIp = '127.0.0.1';

var mockUserName = 'user',
    mockWrongUserName = 'looser',
    mockPassword = 'password',
    mockWrongPassword = 'pas';

describe('\x1b[33mAuthentication\x1b[0m', function() {
  it('Should fail when there are no users', function(done) {
    authentication.login(mockIp, mockWrongUserName, mockWrongPassword)
    .then(done)
    .catch(function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('Should be able to add a new user', function (done) {
    core.db.registerRootUser({ username: mockUserName, password: mockPassword })
    .then(function() { done(); })
    .catch(done);
  });

  it('Should fail with wrong user', function(done) {
    authentication.login(mockIp, mockWrongUserName, mockWrongPassword)
    .then(done)
    .catch(function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('Should fail with wrong password', function(done) {
    authentication.login(mockIp, mockUserName, mockWrongPassword)
    .then(done)
    .catch(function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('Should return user and token with proper credentials', function(done) {
    authentication.login(mockIp, mockUserName, mockPassword)
    .then(function(user) {
      expect(user).to.exist;
      expect(user.userId).to.exist;
      expect(user.token).to.exist;
      done();
    })
    .catch(done);
  });

  it('Should log out', function(done) {
    authentication.login(mockIp, mockUserName, mockPassword)
    .then(function(user) {
      expect(user).to.exist;
      expect(user.userId).to.exist;
      expect(user.token).to.exist;

      authentication.logout(user.userId, user.token, done);
    })
    .catch(done);
  });

});
