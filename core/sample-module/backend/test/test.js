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
    expect = require('chai').expect;

var sample_module = require('..');

// The highest level describe should be the module name.
// This thing -> \x1b[0m will print the name yellow
describe('\x1b[33mSample module\x1b[0m', function() {
  it('Not implemented', function() {
    should.fail(0,1,'Test not implemented');
  });
});
