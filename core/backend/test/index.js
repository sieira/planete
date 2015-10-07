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

/**
 * Dependencies
 */
var should = require('chai').should(),
    expect = require('chai').expect;

var core;

describe('\x1b[33mCore\x1b[0m', function() {
  it('Should init the core', function(done) {
    core = require('_');
    core.init(function(err) {
      expect(err).to.not.exist;
      done();
    })
  });

  it('Should close the core', function(done) {
    core.close(function(err) {
      expect(err).to.not.exist;
      done();
    })
  });
});
