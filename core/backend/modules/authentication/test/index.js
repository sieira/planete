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
    expect = chai.expect;

chai.use(require('chai-passport-strategy'));

var authentication = require('..');

var mockUserName = 'user',
    mockWrongUserName = 'looser',
    mockPassword = 'password',
    mockWrongPassword = 'pas';

describe('\x1b[33mAuthentication\x1b[0m', function() {
  before(function () {
    var db = require('_').db;
    db.registerRootUser({ username: mockUserName, password: mockPassword });
  });

  it('Should fail with wrong user', function(done) {
    authentication.login(mockWrongUserName, mockWrongPassword, function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('Should fail with wrong password', function(done) {
    authentication.login(mockUserName, mockWrongPassword, function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('Should return user and token with proper credentials', function(done) {
    authentication.login(mockUserName, mockPassword, function(err, user) {
      expect(err).to.not.exist;
      expect(user).to.exist;
      expect(user.username).to.exist;
      expect(user.token).to.exist;
      done();
    });
  });
});
