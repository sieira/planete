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
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>
**/
'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect;

chai.use(require('chai-passport-strategy'));

var authentication = require('..');

describe('\x1b[33mAuthentication\x1b[0m', function() {
/*  
  describe('Handling a request with valid credential in header', function() {
    var user,
        info;

   before(function(done) {
     require('_').db.init();

     chai.passport.use(authentication.strategy)
     .success(function(u, i) {
       user = u;
       info = i;
       done();
     })
     .req(function(req) {
       req.headers.authorization = 'Bearer vF9dft4qmT';
     })
     .authenticate();
   });

   it('Should supply user', function() {
     expect(user).to.be.an.object;
     expect(user.id).to.equal('1234');
   });

   it('Should supply info', function() {
     expect(info).to.be.an.object;
     expect(info.scope).to.equal('read');
   });
 });
*/
});
